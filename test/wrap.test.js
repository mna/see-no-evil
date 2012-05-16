/*global describe, it, before, beforeEach, after, afterEach*/
/*jshint asi:true, trailing:true*/

var expect = require('expect.js'),
  sinon = require('sinon'),
  cb = require(process.env.COV ? '../lib-cov/main' : '../lib/main')

describe('see-no-evil', function() {

  describe('#require', function() {
    
    it('should return a function', function() {
      expect(cb).to.be.a('function')
    })

    it('should return a function when called as a function', function() {
      var f = cb()
      expect(f).to.be.a('function')
    })

    it('should accept an options object when called as a function', function() {
      var f = cb({
        error: null
      })
      expect(f).to.be.a('function')
    })

    it('should return different functions if called multiple times', function() {
      var f = cb(),
        f2 = cb()

      expect(f).to.not.be(f2)
    })
  })

  describe('#wrap', function() {

    it('should return a function when called as a function', function() {
      var w = cb(),
        f = w()

      expect(f).to.be.a('function')
    })
  })

  describe('#wrappedcb', function() {

    it('should handle errors by throwing, by default', function() {
      var w = cb(),
        f = w(),
        test = function() {
          f(new Error('test'))
        }

      expect(test).to.throwError()
    })

    it('should call the error callback if specified and an error occurs', function() {
      var spy = sinon.spy(),
        w = cb({
          error: spy
        }),
        f = w()

      f(new Error())
      expect(spy.calledOnce).to.be.ok()
    })

    it('should call the wrapped callback if specified and no error occurs', function() {
      var spyErr = sinon.spy(),
        spyOk = sinon.spy(),
        w = cb({
          error: spyErr
        }),
        f = w(spyOk)

      f()
      expect(spyOk.calledOnce).to.be.ok()
      expect(spyErr.callCount).to.be(0)
    })

    it('should fail if no error and no wrapped function', function() {
      var w = cb(),
        f = w()

      expect(f).to.throwError()
    })
  })
})
