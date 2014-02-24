var assert = require('assert');
var augment = require('./augment');

module.exports = function model (schema) {
  var properties = {}, attrs = schema.attributes, methods = schema.methods, props = schema.properties;
  properties.constructor = function (obj) {
    if (! (this instanceof properties.constructor)) return new properties.constructor(obj);
    if (schema.hasOwnProperty('constructor')) schema.constructor.apply(this, arguments);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (obj && obj.hasOwnProperty(key) && obj[key]) {
          this[key] = this.validate(obj[key], attrs[key]);
        }
      }
    }
    for (var fn in methods) {
      if (methods.hasOwnProperty(fn) && typeof methods[fn] === 'function') {
        this[fn] = methods[fn];
      }
    }
    for (var property in props) {
      if (props.hasOwnProperty(property) && typeof props[property] === 'object') {
        var prop = {};
        if (! props[property].value && ! props[property].get && ! props[property].set) {
          throw new Error('Need to specify a value or getter or setter');
        }
        if (props[property].value) {
          prop.value = props[property].value;
        } else {
          if (props[property].get) prop.get = props[property].get;
          if (props[property].set) prop.set = props[property].set;
        }
        Object.defineProperty(this, property, prop);
      }
    }
  };
  return augment(Model, properties);
}

var Model = augment(Object, {
  validate: function (value, expected) {
    [String, Number, Boolean].forEach(function (clazz) {
      if (expected === clazz) {
        // TODO: break;
        var className = clazz.name.toLowerCase();
        if (typeof value !== className) {
          try {
            value = clazz(value);
          }
          catch (e) {
            // TODO: improve error messaging i.e. indicate key
            assert.equal(typeof value, className);
          }
          if (clazz === Number && isNaN(value)) assert.equal(typeof 'string', className);
        }
      }
    });
    // TODO: more validation types

    return value;
  }
});