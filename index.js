var assert = require('assert');

exports.model = model;
exports.augment = augment;

function model (schema) {
  var properties = {}, attrs = schema.attributes, methods = schema.methods, props = schema.properties;
  properties.constructor = function (obj) {
    if (schema.hasOwnProperty('constructor')) schema.constructor.apply(this, arguments);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (obj.hasOwnProperty(key)) {
          this.validate(obj[key], attrs[key]);
          this[key] = obj[key];
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
    [String, Number].forEach(function (clazz) {
      if (expected === clazz)
        assert.equal(typeof value, clazz.name.toLowerCase());
    });
    // TODO: more validation types
  }
});

function augment (superclass, properties) {
  properties = properties || {};
  var clazz = properties.hasOwnProperty('constructor') ?
    properties.constructor :
    function () { return superclass.apply(this, arguments) };

  clazz.prototype = Object.create(superclass.prototype);
  // copy class methods
  Object.keys(superclass).forEach(function (property) {
    clazz[property] = superclass[property];
  });
  // add custom methods
  Object.keys(properties).forEach(function (property) {
    if (property !== 'constructor')
      clazz.prototype[property] = properties[property];
  });

  return clazz;
}