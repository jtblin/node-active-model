var augment = require('./object').augment;
var extend = require('./object').extend;
var validate = require('./validation');

module.exports = function model (schema) {
  var properties = {}, attrs = schema.attributes, methods = schema.methods, props = schema.properties;
  if (! attrs && ! methods && ! props) {
    attrs = extend({}, schema);
    delete attrs.constructor;
  }
  properties.constructor = function (obj) {
    if (! (this instanceof properties.constructor)) return new properties.constructor(obj);
    if (schema.hasOwnProperty('constructor')) schema.constructor.apply(this, arguments);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (obj && obj.hasOwnProperty(key) && obj[key] !== void 0) {
          this[key] = validate(key, obj[key], attrs[key]);
        }
      }
    }
  };
  var model = augment(Model, properties);
  defineMethods(model.prototype, methods);
  defineProperties(model.prototype, props);

  model.methods = function (methods) {
    defineMethods(model.prototype, methods);
  };
  model.properties = function (properties) {
    defineProperties(model.prototype, properties);
  };
  return model;
};

function defineMethods (object, methods) {
  for (var fn in methods) {
    if (methods.hasOwnProperty(fn) && typeof methods[fn] === 'function') {
      object[fn] = methods[fn];
    }
  }
}

function defineProperties (object, properties) {
  for (var property in properties) {
    if (properties.hasOwnProperty(property) && typeof properties[property] === 'object') {
      Object.defineProperty(object, property, properties[property]);
    }
  }
}

var Model = augment(Object, {});
