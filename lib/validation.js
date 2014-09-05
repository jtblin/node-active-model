var assert = require('assert');
var PRIMARY_TYPES = [String, Number, Boolean, Date];
var COMPOSITE_TYPES = [Array, Object];
var DATA_TYPES = PRIMARY_TYPES.concat(COMPOSITE_TYPES);

module.exports = function (key, value, expected) {
  if (typeof expected === 'function' && DATA_TYPES.indexOf(expected) === -1) return expected(key, value);
  if (COMPOSITE_TYPES.indexOf(expected) > -1) return composite(key, value, expected);
  return type(key, value, expected);
};

function composite(key, value, expected) {
  if (Array === expected) {
    assert.equal(Array.isArray(value), true, 'Expected "' + key + '" to be an array but found ' + value);
  } else {
    assert.equal(typeof value, 'object', 'Expected "' + key + '" to be an object but found ' + value);
    assert.equal(Array.isArray(value), false, 'Expected "' + key + '" to be an object but found an array');
  }
  return value
}

function type (key, value, expected) {
  for (var i = 0, l = PRIMARY_TYPES.length; i < l; i++) {
    var clazz = PRIMARY_TYPES[i];
    if (expected === clazz) {
      var className = clazz.name.toLowerCase();
      if (typeof value !== className) {
        try {
          if (expected === Date) value = new expected(value);
          else value = clazz(value);
        }
        catch (e) {
          assert.equal(typeof value, className, 'Expected "' + key + '" to be a ' + className + ' but found ' + value);
        }
        if (clazz === Number) assert.equal(isNaN(value), false, 'Expected value of "' + key + '" to be a number');
        else if (clazz === Date) assert.notEqual(value, 'Invalid Date', 'Expected value of "' + key + '" to be a date');
      }
      break;
    }
  }
  // TODO: more validation types

  return value;
}
