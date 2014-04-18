# ActiveModel

Data source agnostic opinionated models for Node.js with classic inheritance, basic validations and a clean API.
Models only keep pre-defined properties on initialization which protect against property leakage and ensure your
models remain clean however tey are instantiated.

## Api

### model(schema)

Create and return a new model based on schema.

#### Schema

- attributes: object with allowed attributes as key and validation as value e.g. `width: Number`
- constructor: custom constructor for model that will be executed before model initialization
- methods: methods for the model instances
- properties: object with properties to define as `Object.defineProperty` e.g. `area: { get: function () {return this.width * this.height } }`

#### Validations

Validations supported at the moment are type validation for `Number`, `String`, `Boolean`, `Object`, and `Array`.
When values are not of the correct type, the model will try to cast them to the correct one, otherwise it will throw
an error.

#### Example

    var model = require('active-model').model;
    var assert = require('assert');

    var Rectangle = model({
      attributes: {
        height: Number,
        width: Number
      },
      methods: {
        area: function () { return this.width * this.height; }
      },
      properties: {
        perimeter: {
          get: function () {
            return (this.width + this.height) * 2;
          }
        }
      }
    });

    var rectangle = new Rectangle({ width: 2, height: 3, unknown: true });
    assert.equal(rectangle.width, 2);
    assert.equal(rectangle.height, 3);
    assert.notEqual(rectangle.unknown, true);
    assert.equal(rectangle.area(), 6);
    assert.equal(rectangle.perimeter, 10);

It is also possible to configure the attributes, methods, and properties individually.

    var model = require('active-model').model;
    var assert = require('assert');

    var Rectangle = model({
        height: Number,
        width: Number
    });

    Rectangle.methods({
      area: function () { return this.width * this.height; }
    });

    Rectangle.properties({
      perimeter: {
        get: function () {
          return (this.width + this.height) * 2;
        }
      }
    });

    var rectangle = new Rectangle({ width: 2, height: 3, unknown: true });
    assert.equal(rectangle.width, 2);
    assert.equal(rectangle.height, 3);
    assert.notEqual(rectangle.unknown, true);
    assert.equal(rectangle.area(), 6);
    assert.equal(rectangle.perimeter, 10);

Use a custom constructor

    var model = require('active-model').model;
    var assert = require('assert');

    var Rectangle = model({
        height: Number,
        width: Number,
        constructor: function (width, height) {
          this.width = width;
          this.height = height;
        }
    });

    var rectangle = new Rectangle(2, 3);
    assert.equal(rectangle.width, 2);
    assert.equal(rectangle.height, 3);

### augment(superclass, properties)

Create a new object inherited form superclass with class methods added to object and properties added to object instances.

#### Example

    var augment = require('active-model').augment;
    var Square = augment(Rectangle, {
        constructor: function (side) {
            Rectangle.call(this, side, side);
        }
    });

    var square = new Square(3)
    assert.equal(square.width, 3);
    assert.equal(square.height, 3);
    assert.equal(square.area(), 9);
    assert.equal(square instanceof Rectangle, true);

## Credits

- `augment` method based on [jashkenas](https://news.ycombinator.com/user?id=jashkenas)'s comment in
[Hacker News thread](https://news.ycombinator.com/item?id=7243414)
- API loosely inspired by [mongoose](http://mongoosejs.com/)