const sinon = require("sinon")

var stub = sinon.stub();

stub('hello');

console.log(stub.firstCall.args); //output: ['hello']

var $ = {
    post: function(url, obj, callback) {
        callback();
    }
}

function saveUser(user, callback) {
    $.post('/users', {
      first: user.firstname,
      last: user.lastname
    }, callback);
  }

describe('saveUser', function() {
    it('should call callback after saving', function() {
  
      //We'll stub $.post so a request is not sent
      var post = sinon.stub($, 'post');
      post.yields();
  
      //We can use a spy as the callback so it's easy to verify
      var callback = sinon.spy();
  
      saveUser({ firstname: 'Han', lastname: 'Solo' }, callback);
  
      post.restore();
      sinon.assert.calledOnce(callback);
    });
  });


  describe('saveUser', function() {
    it('should send correct parameters to the expected URL', function() {
  
      //We'll stub $.post same as before
      var post = sinon.stub($, 'post');
  
      //We'll set up some variables to contain the expected results
      var expectedUrl = '/users';
      var expectedParams = {
        first: 'Expected first name',
        last: 'Expected last name'
      };
  
      //We can also set up the user we'll save based on the expected data
      var user = {
        firstname: expectedParams.first,
        lastname: expectedParams.last
      }
  
      saveUser(user, function(){} );
      post.restore();
  
      sinon.assert.calledWith(post, expectedUrl, expectedParams);
    });
  });


  describe('incrementStoredData', function() {
    var store = {
        get: function(data) {},
        set: function(data) {}
    }

    it('should increment stored value by one', function() {
      var storeMock = sinon.mock(store);
      storeMock.expects('get').withArgs('data').returns(0);
      storeMock.expects('set').once().withArgs('data', 1);
  
     // incrementStoredData();
     var v = store.get('data')
     console.log(v)

     store.set('data', 1)
  
      storeMock.restore();
      storeMock.verify();
    });

     
  });