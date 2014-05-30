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
    var destroy;

    if (opts.mozDOMLocalized && opts.mozL10nReady) {
      var outer = function() {
        once(navigator.mozL10n, 'ready', 'isReady', callback);
      };
      wait(document, 'mozDOMLocalized', 'mozLocalized', outer);
      destroy = function() {
        navigator.mozL10n.removeEventListener('ready', callback);
        document.removeEventListener('mozDOMLocalized', outer);
        delete this.destroy;
      };
    } else if (opts.mozDOMLocalized) {
      wait(document, 'mozDOMLocalized', 'mozLocalized', callback);
      destroy = function() {
        document.removeEventListener('mozDOMLocalized', callback);
        delete this.destroy;
      };
    } else if (opts.mozL10nReady) {
      wait(navigator.mozL10n, 'ready', 'isReady', callback);
      destroy = function() {
        navigator.mozL10n.removeEventListener('ready', callback);
        delete this.destroy;
      };
    } else {
      setTimeout(callback);
    }

    return {
      destroy: destroy
    };

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
