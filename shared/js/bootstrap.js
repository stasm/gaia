(function(window) {

  'use strict';

  var defaultOps = {
    mozDOMLocalized: true,
    mozL10nReady: true,
    languageChange: true
  };

  document.mozWait = function(callback, passedOpts) {

    var opts = Object.create(defaultOps);
    for (var name in passedOpts) {
      if (passedOpts.hasOwnProperty(name)) {
        opts[name] = passedOpts[name];
      }
    }

    var wait = opts.languageChange ? every : once;

    if (opts.mozDOMLocalized && opts.mozL10nReady) {
      wait(document, 'mozDOMLocalized', 'mozLocalized', function() {
        once(navigator.mozL10n, 'ready', 'isReady', callback);
      });
    } else if (opts.mozDOMLocalized) {
      wait(document, 'mozDOMLocalized', 'mozLocalized', callback);
    } else if (opts.mozL10nReady) {
      wait(navigator.mozL10n, 'ready', 'isReady', callback);
    } else {
      setTimeout(callback);
    }

  };

  function every(ctx, event, state, callback) {
    if (ctx[state]) {
      setTimeout(callback);
    }
    ctx.addEventListener(event, callback);
  }

  function once(ctx, event, state, callback) {
    if (ctx[state]) {
      setTimeout(callback);
      return;
    }

    ctx.addEventListener(event, function callOnce() {
      ctx.removeEventListener(event, callOnce);
      callback();
    });
  }

})(window);
