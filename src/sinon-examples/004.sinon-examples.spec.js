// The only difference between a stub and a spy is this:
// - a spy wraps existing function and allows you to assert against its behavior
// - a stub replaces an existing function and allows you to assert against its behavior
var sinon = require('sinon'),
sandbox = sinon.sandbox.create();

// This creates a normal function that can be invoked.
const spy = sandbox.spy();
// Do something with it... and then you can make assertions against it later.
expect(spy).to.have.been.calledOnce;

// This wraps `someObject.someMethod` in another function.  After wrapping,
// the behavior of `someObject.someMethod` will be the same, but sinon will
// record the invocations, including all inputs and outputs, and allow you
// to make assertions against it later...
const spy = sandbox.spy(someObject, "someMethod");
// like...
expect(spy).to.have.been.calledOnce;
// which is equivalent to
expect(someObject.someMethod).to.have.been.calledOnce;

// This will replace `someObject.someMethod` with a stub function.  When
// invoked, `someObject.someMethod` will return `undefined` and otherwise
// do nothing.
const stub = sandbox.stub(someObject, "someMethod");
// However, you can make assertions against the invocations...
expect(stub).to.have.been.calledOnce;
expect(someObject.someMethod).to.have.been.calledWith("some-argument");

// A common pattern will be to stub out prototype methods, which should
// occur prior to object instantiation.
const stub = sandbox.stub(Thing.prototype, "someMethod");
const thing = new Thing();
thing.interact();
expect(Thing.prototype.someMethod).to.have.been.calledOnce;

// It is good practice to isolate your "unit" so that it interacts with
// nothing outside of your "unit".  So where, a dependency exists, replace
// it with a stub somehow.

// Because these dependencies often return a value that your unit relies
// upon, you'll often want the stub to return something too.
const stub = sandbox.stub(aDependency, "someMethod", function (input) {
  // do something with `input`
  return `output from ${input}`;
});

// When you're testing how your unit interacts with its dependencies, you
// may put assertions inside the stubbed out function.
const stub = sandbox.stub(aDependency, "someMethod", function (input) {
  expect(input).to.have.property("key", "value");
  return `output from ${input}`;
});

// Also, your tests may be asynchronous, and you want them to complete once
// a dependency has been called.
const stub = sandbox.stub(Thing.prototype, "someMethod", function (input) {
  expect(input).to.have.property("key", "value");
  done();
  return;
});

// One thing to note is that the test containing the above snippet will timeout
// if the exception doesn't pass.  This is because the exception throws an error
// that travels up the call stack.  However, since the inner function is invoked
// asynchronously, the error will propagate up to the event loop scheduler and 
// won't be caught by your test runner.  To resolve this issue, you could use
// something like the following snippet:
function asyncAssertions (done, fn) {
  try {
    fn();
    done();
  } catch (err) {
    done(err);
  }
}

const stub = sandbox.stub(Thing.prototype, "someMethod", function (input) {
  asyncAssertions(done, () => {
    expect(input).to.have.property("key", "value");
  });
});


      
