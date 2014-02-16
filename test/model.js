describe('active-model', function () {

  var Rectangle, Square;
  var model = require('../').model;
  var augment = require('../').augment;

  before(function () {
    Rectangle = model({
      constructor: function (width, height) {
        this.height = height;
        this.width = width;
      },
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

    Square = augment(Rectangle, {
      constructor: function (side) {
        Rectangle.call(this, side, side);
      }
    });
  });

  describe('model', function () {
    it('sets the properties', function () {
      var rectangle = new Rectangle({ width: 2, height: 3 });
      rectangle.width.should.be.equal(2);
      rectangle.height.should.be.equal(3);
    });

    it('only keeps defined properties', function () {
      var rectangle = new Rectangle({ width: 2, height: 3, unknown: true });
      expect(rectangle.unknown).to.be.equal(undefined);
    });

    it('sets the methods', function () {
      var rectangle = new Rectangle({ width: 2, height: 3 });
      rectangle.area().should.be.equal(6);
    });

    // TODO: add test for properties:value and properties:set
    it('sets the properties', function () {
      var rectangle = new Rectangle({ width: 2, height: 3 });
      rectangle.perimeter.should.be.equal(10);
    });

    it('validates property types', function () {
      var incorrectType = function () { return new Rectangle({ width: 2, height: '3' })};
      expect(incorrectType).to.throw(/"string" == "number"/);
    });
  });

  describe('augment', function () {
    it('inherits from superclass', function () {
      var square = new Square(3);
      square.width.should.be.equal(3);
      square.height.should.be.equal(3);
      square.area().should.be.equal(9);
    });

    // TODO: add test for class methods
  });

});
