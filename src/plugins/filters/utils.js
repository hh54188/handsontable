import { getComparisonFunction } from '../../helpers/feature';
import { arrayUnique, arrayEach } from '../../helpers/array';

const sortCompare = getComparisonFunction();

/**
 * Comparison function for sorting purposes.
 *
 * @param {*} a The first value to compare.
 * @param {*} b The second value to compare.
 * @returns {number} Returns number from -1 to 1.
 */
export function sortComparison(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return sortCompare(a, b);
}

/**
 * Convert raw value into visual value.
 *
 * @param {*} value The value to convert.
 * @param {string} defaultEmptyValue Default value for empty cells.
 * @returns {*}
 */
export function toVisualValue(value, defaultEmptyValue) {
  let visualValue = value;

  if (visualValue === '') {
    visualValue = `(${defaultEmptyValue})`;
  }

  return visualValue;
}

const SUPPORT_SET_CONSTRUCTOR = new Set([1]).has(1);
const SUPPORT_FAST_DEDUPE = SUPPORT_SET_CONSTRUCTOR && typeof Array.from === 'function';

/**
 * Create an array assertion to compare if an element exists in that array (in a more efficient way than .indexOf).
 *
 * @param {Array} initialData Values to compare.
 * @returns {Function}
 */
export function createArrayAssertion(initialData) {
  let dataset = initialData;

  if (SUPPORT_SET_CONSTRUCTOR) {
    dataset = new Set(dataset);
  }

  return function(value) {
    let result;

    if (SUPPORT_SET_CONSTRUCTOR) {
      result = dataset.has(value);
    } else {
      /* eslint-disable no-bitwise */
      result = !!~dataset.indexOf(value);
    }

    return result;
  };
}

/**
 * Convert empty-ish values like null and undefined to an empty string.
 *
 * @param {*} value Value to check.
 * @returns {string}
 */
export function toEmptyString(value) {
  return value === null || value === void 0 ? '' : value;
}

// https://stackoverflow.com/a/25047903/508236
const isDate = function(date) {
  // eslint-disable-next-line
  return date !== null && (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date));
};

const isString = function(target) {
  return Object.prototype.toString.call(target) === '[object String]';
};

// https://stackoverflow.com/a/175787/508236
const isNumber = function(target) {
  return Object.prototype.toString.call(target) === '[object Number]'
    || (!isNaN(target) && !isNaN(parseFloat(target)));
};

const removeEmptyValue = function(values) {
  let result = false;

  values.forEach((item, index) => {
    if (!item) {
      result = true;
      values.splice(index, 1);
    }
  });

  return result;
};

const removeNAValue = function(values) {
  let result = false;

  values.forEach((item, index) => {
    if (item.toString() === 'N/A') {
      result = true;
      values.splice(index, 1);
    }
  });

  return result;
};

const removePleaseSelectValue = function(values) {
  let result = false;

  values.forEach((item, index) => {
    if (item.toString() === 'Please Select') {
      result = true;
      values.splice(index, 1);
    }
  });

  return result;
};

const sortDateElement = function(values) {
  values.sort((a, b) => {
    return +new Date(a) >= +new Date(b) ? 1 : -1;
  });
};

const sortStringElement = function(values) {
  values.sort((a, b) => {
    return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1;
  });
};

const sortNumberElement = function(values) {
  values.sort((a, b) => {
    return parseFloat(a.value, 10) > parseFloat(b.value, 10) ? 1 : -1;
  });
};

const defaultSortFn = function(values) {
  values.sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (a === b) {
      return 0;
    }

    return a > b ? 1 : -1;
  });
};

/**
 * Unify column values (replace `null` and `undefined` values into empty string, unique values and sort them).
 *
 * @param {Array} values An array of values.
 * @returns {Array}
 */
export function unifyColumnValues(values) {
  let unifiedValues = values;

  if (SUPPORT_FAST_DEDUPE) {
    unifiedValues = Array.from(new Set(unifiedValues));
  } else {
    unifiedValues = arrayUnique(unifiedValues);
  }

  const hasNAValue = removeNAValue(unifiedValues);
  const hasEmptyValue = removeEmptyValue(unifiedValues);
  const hasPleaseSelectValue = removePleaseSelectValue(unifiedValues);

  const everyElementIsNumberType = unifiedValues.every(item => isNumber(item));
  const everyElementIsDateType = unifiedValues.every(item => isDate(item));
  const everyElementIsStringType = unifiedValues.every(item => isString(item));

  if (everyElementIsNumberType) {
    sortNumberElement(unifiedValues);
  } else if (everyElementIsDateType) {
    sortDateElement(unifiedValues);
  } else if (everyElementIsStringType) {
    sortStringElement(unifiedValues);
  } else {
    defaultSortFn(unifiedValues);
  }

  if (hasEmptyValue) {
    unifiedValues.unshift('');
  }
  if (hasNAValue) {
    unifiedValues.unshift('N/A');
  }
  if (hasPleaseSelectValue) {
    unifiedValues.unshift('Please Select');
  }

  return unifiedValues;
}

/**
 * Intersect 'base' values with 'selected' values and return an array of object.
 *
 * @param {Array} base An array of base values.
 * @param {Array} selected An array of selected values.
 * @param {string} defaultEmptyValue Default value for empty cells.
 * @param {Function} [callback] A callback function which is invoked for every item in an array.
 * @returns {Array}
 */
export function intersectValues(base, selected, defaultEmptyValue, callback) {
  const result = [];
  const same = base === selected;
  let selectedItemsAssertion;

  if (!same) {
    selectedItemsAssertion = createArrayAssertion(selected);
  }

  arrayEach(base, (value) => {
    let checked = false;

    if (same || selectedItemsAssertion(value)) {
      checked = true;
    }

    const item = { checked, value, visualValue: toVisualValue(value, defaultEmptyValue) };

    if (callback) {
      callback(item);
    }

    result.push(item);
  });

  return result;
}
