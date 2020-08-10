import {cardAttributes, complexAttributes} from '@/global-vars';
import {isEmptyOrNull} from '@/functions';
// import {denormalize} from 'normalizr';
// import {profiles} from './schemas';

const simpleAttributes = cardAttributes.filter((attr) => {
  return complexAttributes.indexOf(attr) === -1;
});

/**
 * Function to create a patch object for JSON patch (RFC 6902)
 * @param {String} attribute path to be patched
 * @param {any} currentValue value that is currently assigned
 * @param {any} newValue New value that is to be patched
 * @return {Object} dictionary of items in line with JSON Patch
 */
function generatePatchObject(attribute, currentValue, newValue) {
  let operation = 'replace';
  if (isEmptyOrNull(newValue)) {
    // If it removes the current value
    operation = 'remove';
  } else if (isEmptyOrNull(currentValue)) {
    operation = 'add';
  }
  let patch;
  if (operation === 'remove') {
    patch = {op: operation, path: '/' + attribute};
  } else {
    patch = {op: operation, path: '/' + attribute, value: newValue};
  }
  return patch;
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
  const patchOps = needPatchAttrs.map((attr) => {
    return generatePatchObject(attr, original[attr], modified[attr]);
  });

  return patchOps;

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
}

// Actions for cards vuex module
export default {
  updateCardByPatch({state}, {id, original}) {
    let originalCard = original;
    const modifiedCard = state.profile[id];
    if (typeof original === 'string') {
      originalCard = JSON.parse(original);
    }
    generateDiffForPatch(state, originalCard, modifiedCard);
  },
};
