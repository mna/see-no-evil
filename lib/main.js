/*global module*/
/*jshint asi:true,trailing:true*/

module.exports = function(opts) {
  // "Global" callbacks defined by default for all wrappers created from this closure
  var deferrcb = opts.error,
    deftruthycb = opts.truthy,
    ctx = opts.ctx

  var wrap = function(fn, truthy, err) {
    // Truthy and error callbacks may be overridden for a specific callback wrapper
    var errcb = err || deferrcb,
      truthycb = truthy || deftruthycb

    var wrappedcb = function(err, arg1) {
      if (err) {
        return errcb(err)
      } else if ((!arg1) && (truthycb)) {
        return truthycb(arg1)
      }

      // Strip the error from the arguments
      return fn.apply(ctx || this, Array.prototype.splice.call(arguments, 1))
    }

    // Ability to create wrappers from a wrapped callback
    wrappedcb.wrap = wrap

    return wrappedcb
  }
}
