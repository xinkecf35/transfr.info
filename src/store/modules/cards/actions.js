import isEqual from 'lodash.isequal';
import {cardAttributes, complexAttributes} from '@/global-vars';
import {isEmptyOrNull} from '@/functions';
// import {addressSchema, emailSchema, telephoneSchema} from './schemas';

const simpleAttributes = cardAttributes.filter((attr) => {
  return complexAttributes.indexOf(attr) === -1;
});

// const attrSchemaMap = {
//   'address': addressSchema,
//   'email': emailSchema,
//   'telephone': telephoneSchema,
// };

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
  let path = ''/' + attribute';
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

  // map original values indexes to modified index over previously inserted
  //  values; fill with empty object if object at index is different
  // or non-existent.
  const newToModifiedMap = mapOriginalIndexesToModified();

  return newToModifiedMap.concat(addedValues);

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
  });

  return simplePatchOps.concat(combinedPatchOps.flat(2));

  /**
   * Inner function to generate patch object on given attributes
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
  updateCardByPatch({state, getters}, {id, original}) {
    let originalCard = original;
    const modifiedCard = getters.getDenormalizedCard(id);
    if (typeof original === 'string') {
      originalCard = JSON.parse(original);
    }
    generateDiffForPatch(state, originalCard, modifiedCard);
  },
};
