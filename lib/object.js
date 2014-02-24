exports.augment = function augment (superclass, properties) {
  properties = properties || {};
  var clazz = properties.hasOwnProperty('constructor') ?
    properties.constructor :
    function () { return superclass.apply(this, arguments) };

  clazz.prototype = Object.create(superclass.prototype);
  // copy class methods
  exports.extend(clazz, superclass);
  // add custom methods
  Object.keys(properties).forEach(function (property) {
    if (property !== 'constructor')
      clazz.prototype[property] = properties[property];
  });

  return clazz;
};

exports.extend = function extend (origin, other) {
  if (! other || typeof other !== 'object') return origin;
  Object.keys(other).forEach(function (property) {
    origin[property] = other[property];
  });
  return origin;
};