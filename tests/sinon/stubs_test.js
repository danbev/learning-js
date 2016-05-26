var sinon = require('sinon');
var assert = require('assert');

describe('Sinon stubs', function() {
  var obj = {
    'first': function() {
      return 1;
    },
    'second': function() {
      return 2;
    },
    'third': function(str) {
      return "str=" + str;
    },
    'fourth': function(cb1, cb2) {
    }
  };

  it('stub is callable', function() {
    var stub = sinon.stub();
    stub('testing');
    assert.equal(stub.firstCall.args, 'testing');
  });

  it('stub a single method using onCall', function() {
    var stub = sinon.stub(obj, 'second');
    stub.onCall(0).returns(3);
    assert.equal(obj.second(), 3);
    stub.restore();
    assert.equal(obj.second(), 2);
  });

  it('stub a single method using withArgs', function() {
    var stub = sinon.stub(obj, 'third');
    stub.withArgs(sinon.match.string).returns('bajja');
    stub.withArgs(sinon.match.number).returns('number');
    assert.equal(obj.third('test'), 'bajja');
    assert.equal(obj.third(10), 'number');
    stub.restore();
    assert.equal(obj.third('test'), 'str=test' );
  });

  it('stub a single method using returnsArg ', function() {
    var stub = sinon.stub(obj, 'third');
    stub.returnsArg(0);
    assert.equal(obj.third('test'), 'test');
    stub.restore();
  });

  it('stub a single method calling second callback using callsArgWith ', function() {
    var stub = sinon.stub(obj, 'fourth');
    stub.callsArgWith(1, 'bajja');
    obj.fourth(function callback1() {}, function callback2(param) {
      assert.equal(param, 'bajja');
    });
    stub.restore();
  });

  it('callsArgWith ', function() {
    var stub = sinon.stub();
    // call the second callback when this stub in invokec
    stub.callsArgWith(1, 'second callback');

    stub(function callback1() {}, function callback2(param) {
      assert.equal(param, 'second callback');
    });
  });

  it('stub a single method calling callback using yields ', function() {
    var stub = sinon.stub(obj, 'fourth');
    stub.yields('bajja');
    obj.fourth(function callback2(param) {
      assert.equal(param, 'bajja');
    });
    stub.restore();
  });

  it('stub a returns statement', function() {
    var stub = sinon.stub(obj, 'first');
    stub.returns(stub.args);
    var result = obj.first('bajja');
    console.log(result);
    stub.restore();
  });

});
