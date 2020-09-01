import isEqual from 'lodash.isequal';
import {baseURL, complexAttributes, simpleAttributes} from '@/global-vars';
import {ajaxRequest, isEmptyOrNull, isObjectEmpty} from '@/functions';


/**
 * Function to create a patch object for JSON patch (RFC 6902)
 * @param {String} attribute path to be patched
 * @param {any} currentValue value that is currently assigned
 * @param {any} newValue New value that is to be patched
 * @param {number} idx optional, for index over array operation
 * @return {Object} dictionary of items in line with JSON Patch
 */
function generatePatchObject(attribute, currentValue, newValue, idx=-1) {
  let operation = 'replace';
  if (isEmptyOrNull(newValue)) {
    // If it removes the current value
    operation = 'remove';
  } else if (isEmptyOrNull(currentValue)) {
    operation = 'add';
  }
  let patch;
  let path = '/' + attribute;
  if (idx !== -1 ) {
    path = `/${attribute}/${idx}`;
  }
  if (operation === 'remove') {
    patch = {op: operation, path};
  } else {
    patch = {op: operation, path, value: newValue};
  }
  return patch;
}

/**
 * Function to create a patch object for JSON patch (RFC 6902)
 * For array values, operate over index
 * @param {string} attr attribute we're patching over
 * @param {array} originalValues value that is currently assigned
 * @param {array} newValues New value that is to be patched
 * @return {array} array of patch objects
 */
function generatePatchesOverArray(attr, originalValues, newValues) {
  const addedValues = newValues.filter((val) => val._id.indexOf('temp') === 0);
  const existingValues = newValues.filter((val) => {
    return val._id.indexOf('temp') === -1;
  });

  const newToModifiedMap = mapOriginalIndexesToModified();
  // note sort the following with enum (or have backend figure it out)
  const existingValuePatches = newToModifiedMap.map((val, idx) => {
    if (isObjectEmpty(val.current)) {
      return generatePatchObject(attr, val.original, undefined, idx);
    } else if (!isEqual(val.original, val.current)) {
      return generatePatchObject(attr, val.original, val.current, idx);
    }
  }).filter((val) => !isEmptyOrNull(val));
  const newValuePatches = addedValues.map((val, idx) => {
    delete val._id;
    const newIndex = originalValues.length + idx;
    return generatePatchObject(attr, '', val, newIndex);
  });
  const patches = existingValuePatches.concat(newValuePatches);
  return patches.sort(comparePatches);

  /**
   * Helper function to map indexes of orignal values;
   * iterates over the original values and map as necessary
   * of indices of deleted values; aims to work over insertion
   * order of original array
   * @return {array} mapped array of objects to
   */
  function mapOriginalIndexesToModified() {
    return originalValues.map((val, idx) => {
      const newIdx = existingValues.findIndex((modifiedVal) => {
        return modifiedVal._id === val._id;
      });
      if (newIdx == -1) {
        // Value been deleted
        return {original: val, current: {}};
      } else if (newIdx !== idx) {
        // value shifted due to changes in array.
        return {original: val, current: existingValues[newIdx]};
      } else {
        return {original: val, current: existingValues[idx]};
      }
    });
  }

  /**
   * compare function to sort patch objects
   * @param {object} a patch object with op property
   * @param {object} b patch object with op property
   * @return {number} different between ops, based on compareFunction convention
   */
  function comparePatches(a, b) {
    const opEnum = {
      'add': 1,
      'replace': 2,
      'remove': 3,
    };
    return opEnum[a.op] - opEnum[b.op];
  }
}

/**
 * Creates an Array of JSON Patch operation for
 * updating card by PATCH method
 * @param {object} state state from vuex
 * @param {object} original original state of card
 * @param {object} modified current state of card in vuex
 * @return {array} Array of patch objects
 */
function generateDiffForPatch(state, original, modified) {
  // over the simple attributes first
  const needPatchAttrs = simpleAttributes.filter(filterForPatch);
  const simplePatchOps = needPatchAttrs.map((attr) => {
    return generatePatchObject(attr, original[attr], modified[attr]);
  });

  const combinedPatchAttr = complexAttributes.filter(combinedFilterForPatch);
  const combinedPatchOps = combinedPatchAttr.map((attr) => {
    return generatePatchesOverArray(attr, original[attr], modified[attr]);
  }).flat(1);

  return simplePatchOps.concat(combinedPatchOps);

  /**
l   * Inner function to generate patch object on given attributes
   * @param {string} attr attribute we're checking
   * @return {boolean} returns whether to generate patch
   */
  function filterForPatch(attr) {
    const originalValue = original[attr];
    const modifiedValue = modified[attr];
    if (isEmptyOrNull(originalValue) && isEmptyOrNull(modifiedValue)) {
      return false;
    } else if (originalValue === modifiedValue) {
      return false;
    }
    return true;
  }

  /**
   * Inner function to generate patch object on given attributes
   * @param {string} attr attribute we're checking
   * @return {boolean} returns whether to generate patch
   */
  function combinedFilterForPatch(attr) {
    let originalValue = original[attr];
    let modifiedValue = modified[attr];

    if (!Array.isArray(originalValue) || !Array.isArray(modifiedValue)) {
      throw new TypeError(`One of the values are not a Array; \
      original: ${typeof originalValue} modified: ${typeof modifiedValue}`);
    }
    if (!isEqual(originalValue, modifiedValue)) {
      // check arrays are equal, without evaluating elements
      return true;
    }
    return false;
  }
}

// Actions for cards vuex module
export default {
  undoCardChanges({commit}, params) {
    const {id} = params;
    commit('resetCard', params);
    commit('removeAllTempValues', id);
  },
  updateCardByPatch({state, commit, getters, rootState}, {id, original}) {
    let originalCard = original;
    const modifiedCard = getters.getDenormalizedCard(id);
    if (typeof original === 'string') {
      originalCard = JSON.parse(original);
    }
    const patch = generateDiffForPatch(state, originalCard, modifiedCard);
    const patchURL = `${baseURL}/userdata/profile/${id}`;
    const patchBody = JSON.stringify({patch});
    const headers = [{name: 'X-CSRF-TOKEN', value: rootState.csrf}];
    return ajaxRequest('PATCH', patchURL, patchBody, headers)
      .then((response) => {
        if (!response.meta.success) {
          throw response.meta.message;
        }
        commit('updateCardFromPatch', {id, card: response.card});
        commit('removeAllTempValues');
      });
  },
};
