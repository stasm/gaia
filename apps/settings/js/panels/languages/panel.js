'use strict';

define(function(require) {
  var SettingsPanel = require('modules/settings_panel');
  var Languages = require('panels/languages/languages');

  return function ctor_languages_panel() {
    var languages = Languages();
    var localizedEventListener;

    return SettingsPanel({
      onBeforeShow: function() {
        localizedEventListener = function() {
          languages.onLocalized(languages);
        };
        document.mozWait(localizedEventListener, { mozL10nReady: false });
      },
      onBeforeHide: function() {
        navigator.mozL10n.removeEventListener('ready', localizedEventListener);
      },
      onInit: function(panel) {
        languages.onInit(panel);
      }
    });
  };
});
