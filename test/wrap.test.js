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

    it('should call the wrapped callback without the error (null) as first argument', function() {
      var spyOk = sinon.spy(),
        w = cb(),
        f = w(spyOk)

      f(null, 1)
      expect(spyOk.calledOnce).to.be.ok()
      expect(spyOk.calledWithExactly(1)).to.be.ok()
    })

    it('should fail if no error and no wrapped function', function() {
      var w = cb(),
        f = w()

      expect(f).to.throwError()
    })

    it('should call the "truthy expected" callback if arg1 is falsy', function() {
      var spyTru = sinon.spy(),
        spyErr = sinon.spy(),
        spyOk = sinon.spy(),
        w = cb({
          error: spyErr,
          truthy: spyTru
        }),
        f = w(spyOk)

      f(null, undefined)
      expect(spyTru.calledOnce).to.be.ok()
      expect(spyErr.callCount).to.be(0)
      expect(spyOk.callCount).to.be(0)
    })

    it('should offer a wrap function', function() {
      var w = cb(),
        f = w()

      expect(f.wrap).to.not.be(undefined)
      expect(f.wrap).to.be.a('function')
    })
  })

  describe('#wrappedcb.wrap', function() {

    it('should create a distinct wrapped callback when sub-wrap is called', function() {
      var w = cb(),
        f = w(),
        f2 = f.wrap()

      expect(f).to.not.be(f2)
    })

    it('should use the same default error callback by default', function() {
      var spy = sinon.spy(),
        w = cb({
          error: spy
        }),
        f = w(),
        f2 = f.wrap()

      f(new Error())
      f2(new Error())
      expect(spy.calledTwice).to.be.ok()
    })

    it('should allow defining specific error callback, overriding the default', function() {
      var spy = sinon.spy(),
        spy2 = sinon.spy(),
        w = cb({
          error: spy
        }),
        f = w(),
        f2 = f.wrap(null, null, spy2)

      f(new Error())
      f2(new Error())
      expect(spy.calledOnce).to.be.ok()
      expect(spy2.calledOnce).to.be.ok()
    })

    it('should use the same default truthy callback by default', function() {
      var spy = sinon.spy(),
        w = cb({
          truthy: spy
        }),
        f = w(),
        f2 = f.wrap()

      f(null, false)
      f2(null, 0)
      expect(spy.calledTwice).to.be.ok()
    })

    it('should allow defining specific truthy callback, overriding the default', function() {
      var spy = sinon.spy(),
        spy2 = sinon.spy(),
        w = cb({
          truthy: spy
        }),
        f = w(),
        f2 = f.wrap(null, spy2)

      f(null, '')
      f2(null, null)
      expect(spy.calledOnce).to.be.ok()
      expect(spy2.calledOnce).to.be.ok()
    })
  })
})
