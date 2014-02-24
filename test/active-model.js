describe('active-model', function () {

  var Rectangle, Square, Circle;
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
        width: Number,
        name: String
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

    Circle = model({
      radius: Number
    });
  });

  describe('model', function () {

    describe('schema', function () {
      it('sets the attributes', function () {
        var rectangle = new Rectangle({ width: 2, height: 3, name: 'rec'});
        rectangle.width.should.be.equal(2);
        rectangle.height.should.be.equal(3);
        rectangle.name.should.be.equal('rec');
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

      it('allows defining attributes directly', function () {
        var circle = new Circle({radius: 3});
        circle.radius.should.be.equal(3);
      });

      it('allows adding methods subsequently', function () {
        Circle.methods({
          circumference: function () {
            return Math.PI * this.radius * 2;
          }
        });
        var circle = new Circle({radius: 3});
        circle.circumference().should.be.equal(18.84955592153876);
      });

      it('allows adding properties subsequently', function () {
        Circle.properties({
          diameter: {
            get: function () {
              return this.radius * 2;
            }
          }
        });
        var circle = new Circle({radius: 3});
        circle.diameter.should.be.equal(6);
      });
    });

    describe('constructor', function () {
      it('always returns a new instance', function () {
        var rectangle = Rectangle({ width: 2, height: 3 });
        expect(rectangle).to.be.instanceOf(Rectangle);
      });

      it('supports initialization with undefined', function () {
        var rectangle = new Rectangle();
        expect(rectangle).to.exist;
      });

      it('invokes defined constructor', function () {
        var rectangle = new Rectangle(2, 3);
        rectangle.area().should.be.equal(6);
      });

      it('allows objects', function () {
        var Post = model({
          title: String,
          comments: Object
        });
        var post = new Post({title: 'Great article', comments: {'John': 'Awesome'}});
        post.comments['John'].should.equal('Awesome');
      });

      it('allows arrays', function () {
        var Post = model({
          title: String,
          comments: Array
        });
        var post = new Post({title: 'Great article', comments: ['Awesome']});
        post.comments[0].should.equal('Awesome');
      });
    });

    describe('validations', function () {
      it('validates property types', function () {
        var incorrectType = function () { return new Rectangle({ width: 2, height: 'abc' })};
        expect(incorrectType).to.throw('Expected value of "height"to be a number');
      });

      it('casts to correct type', function () {
        var rectangle = new Rectangle({ width: 2, height: '3' });
        rectangle.height.should.be.equal(3);
      });

      it('does not try to validate undefined or null value', function () {
        var rectangle = new Rectangle({ width: 2, name: null });
        rectangle.width.should.be.equal(2);
      });

      it('validates objects correctly', function () {
        var Post = model({
          title: String,
          comments: Object
        });
        var incorrectType = function () { return new Post({title: 'Great article', comments: ['Awesome']})};
        expect(incorrectType).to.throw('Expected "comments" to be an object but found an array');
      });

      it('validates arrays correctly', function () {
        var Post = model({
          title: String,
          comments: Array
        });
        var incorrectType = function () { return new Post({title: 'Great article', comments: {'John': 'Awesome'}})};
        expect(incorrectType).to.throw('Expected "comments" to be an array but found [object Object]');
      });

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
