module.exports = function augment (superclass, properties) {
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
};
