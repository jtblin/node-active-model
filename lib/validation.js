var assert = require('assert');

module.exports = function (key, value, expected) {
  var primaries = [String, Number, Boolean];
  for (var i = 0; i < 3; i++) {
    var clazz = primaries[i];
    if (expected === clazz) {
      var className = clazz.name.toLowerCase();
      if (typeof value !== className) {
        try {
          value = clazz(value);
        }
        catch (e) {
          assert.equal(typeof value, className, 'Expected "' + key + '"to be a ' + className + ' but found ' + value);
        }
        if (clazz === Number && isNaN(value)) assert.equal(typeof 'string', className, 'Expected "' + key + '"to be a number');
      }
      break;
    }
  }
  // TODO: more validation types

  return value;
};
