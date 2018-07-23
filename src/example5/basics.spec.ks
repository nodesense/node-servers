// All you need to know about Mocha testing in 60 lines

// Mocha Testing: http://visionmedia.github.io/mocha/
// Installation: npm install -g mocha
// Run:     mocha [test folder or test file]
// Example: mocha . (Run all js tests in folder)
// 
// Usefull parameters:
// 	mocha -w . : Watch file changes and re-run tests
// 	mocha -d . : Debug mode
// 	mocha -R [reporter name] : Different views of results. Other reporters are: dot, spec. list, json, html-cov ...

var assert = require('assert')

// Test group 'String Management'
describe('String Management',function(){

  var text
  this.timeout(12000)	// Timeout for all tests
  this.slow(400)		// Slow time. 
  // If any test is too slow it appears like yellow dot (in dot Matrix reporter) or red time in (Spec reporter)

  // Initializing test (it will be reinitialized before each test)
  // Others 'hooks': before(), after(), beforeEach(), afterEach() 
  beforeEach(function(){
	text = "España es Bella"
  })

  // Test group 'Substring'
  describe('Substring',function(){
      
    // Test 'Substring Test'
    it('Substring Test',function(){
      // For assertions you can use libraries like 'should', 'expect', 'chai' ...
      assert.equal("Bella",text.substring(10,15))
    })

    // ONLY this test will be run (in this group)
    // It is asynchronous code. Check that function use 'done' callback. Mocha know with it that is async code.
    it.only('Substring Test 2',function(done){
      this.timeout(12000)	// Decreasing timeout for this test
      setTimeout(function(){
        assert.equal("Bella",text.substring(10,15))
        done()
      }, 600)
    })
  })

  describe('Length',function(){
    // Skipping test
    it.skip('Length of string',function(){
      assert.equal(text.length,15)
    })

    it('Length of string 2',function(){
      assert.equal(text.length,15)
    })
  })
})