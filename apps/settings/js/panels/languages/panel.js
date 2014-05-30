'use strict';

define(function(require) {
  var SettingsPanel = require('modules/settings_panel');
  var Languages = require('panels/languages/languages');

  return function ctor_languages_panel() {
    var languages = Languages();
    var localizedEventListener;
    var mozWaitHandler;

    return SettingsPanel({
      onBeforeShow: function() {
        localizedEventListener = function() {
          languages.onLocalized(languages);
        };
        mozWaitHandler = document.mozWait(localizedEventListener,
                                        { mozL10nReady: false });
      },
      onBeforeHide: function() {
        mozWaitHandler.destroy();
      },
      onInit: function(panel) {
        languages.onInit(panel);
      }
    });
  };
});
