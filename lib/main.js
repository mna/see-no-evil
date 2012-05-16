/*global module*/
/*jshint asi:true,trailing:true*/

module.exports = function(o) {
  // "Global" callbacks defined by default for all wrappers created from this closure
  var defError = function(err) {
      throw err
    },
    opts = o || {},
    gErrCb = opts.error || defError,
    gTruthyCb = opts.truthy,
    gFalsyCb = opts.falsy,
    gCtx = opts.ctx

  var wrap = function(fn, o2) {
    // Callbacks and context may be overridden for a specific callback wrapper
    var opts = o2 || {},
      errcb = opts.error || gErrCb,
      truthycb = opts.truthy || gTruthyCb,
      falsycb = opts.falsy || gFalsyCb,
      ctx = opts.ctx || gCtx

    var wrappedcb = function(err, arg1) {
      if (err) {
        return errcb(err)
      } else if ((arg1) && (truthycb)) {
        return truthycb(err, arg1)
      } else if ((!arg1) && (falsycb)) {
        return falsycb(err, arg1)
      }

      // Keep the error from the arguments, can be useful since most standard libraries
      // expect the error as first argument
      return fn.apply(ctx || this, arguments)
    }

    // Ability to create wrappers from a wrapped callback
    wrappedcb.wrap = wrap

    return wrappedcb
  }

  return wrap
}
