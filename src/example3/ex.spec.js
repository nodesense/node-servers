var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');

function myAsyncFunction(callback) {
  // 50ms delay before callback
  setTimeout(function() {
    console.log('hello');
    callback('hello');
  }, 50);
}

// first (and only) set of tests
describe('myAsyncFunction', function(){
  var sandbox; // sinon.js sandbox

  // this function will be called before every single test
  beforeEach(function() {
    // create a sandbox
    sandbox = sinon.sandbox.create();
    // stub some console methods (replaces object.method with a stub function)
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });

  // this function will be called after every single test
  afterEach(function() {
    // restore the environment as it was before
    sandbox.restore();
  });
  
  // first test
  it('should return hello as callback parameter', function(done){
    myAsyncFunction(function(data) { // callback
      // test stuff
      // the 3 assertions are doing the same thing,
      // it's just 3 different ways to write it
      assert.equal(data, 'hello');
      data.should.equal('hello');
      expect(data).to.eql('hello');
      // this test is done, go to the next one
      done();
    });
  });

  // second test
  it('should console.log hello', function(done) {
    myAsyncFunction(function(data) {
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWithExactly(console.log, 'hello');
      sinon.assert.notCalled(console.error);
      done();
    });
  });
});