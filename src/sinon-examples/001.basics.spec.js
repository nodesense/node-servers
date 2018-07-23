var sinon = require('sinon');
var assert = require("assert")
var spy = sinon.spy();

//We can call a spy like a function
spy('Node.js', 'React');

//Now we can get information about the call
console.log(spy.firstCall.args); //output: ['Node.js', 'React']


var user = {
    
    setName: function(name){
      this.name = name;
    }
  }
  
  //Create a spy for the setName function
  var setNameSpy = sinon.spy(user, 'setName');
  
  //Now, any time we call the function, the spy logs information about it
  user.setName('React Framework');
  
  //Which we can see by looking at the spy object
  console.log(setNameSpy.callCount); //output: 1
  
  //Important final step - remove the spy
  setNameSpy.restore();


  function myFunction(condition, callback){
    if(condition){
      callback();
    }
  }


  function myFunction2(condition, callback){
    if(condition){
      callback(10, 20);
    }
  }
  
  describe('myFunction', function() {
    it('should call the callback function', function() {
      var callback = sinon.spy();
  
      myFunction(true, callback);
  
      //assert(callback.calledOnce);
      //assert(callback.calledOnce, 'Callback was not called once');

      // or 

      sinon.assert.calledOnce(callback);

    });

    it('should call the callback specific argument function', function() {
      var callback = sinon.spy();
  
      myFunction2(true, callback);
   

      sinon.assert.calledWith(callback, 10, 20);

    });
  });