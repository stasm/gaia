'use strict';

(function(exports) {

  /**
   * Name of the global home screen settings datastore.
   */
  const SETTINGS_STORE = 'homescreen_settings';

  /**
   * Stored settings version, for use when changing/refactoring settings
   * storage.
   */
  const SETTINGS_VERSION = 0;

  /**
   * Name of the global home screen columns setting.
   */
  const COLUMNS_SETTING = 'grid.cols';

  function Settings() {
    // Initialise default settings
    this.small = false;
    this.firstRun = false;

    // Listen to external settings changes
    if (navigator.getDataStores) {
      navigator.getDataStores(SETTINGS_STORE).then(stores => {
        if (stores.length < 1) {
          return Promise.reject('Settings datastore inaccessible');
        }

        var signalChange = () => {
          this.save();
          window.dispatchEvent(new CustomEvent('settings-changed'));
        };

        var syncSmallSetting = (signal) => {
          stores[0].get(COLUMNS_SETTING).then(cols => {
            this.small = cols > 3;
            signalChange();
          });
        };

        stores[0].addEventListener('change', e => {
          switch (e.id) {
            case COLUMNS_SETTING:
              syncSmallSetting();
              break;
          }
        });

        syncSmallSetting();
      }, e => {
        console.error('Error retrieving home screen settings datastore:', e);
      });
    } else {
      console.error('Datastore API unavailable');
    }

    // Restore existing settings
    var settingsString = localStorage.getItem('settings');
    if (!settingsString) {
      this.firstRun = true;
      return;
    }

    var settings = JSON.parse(settingsString);
    if (settings.version !== SETTINGS_VERSION) {
      return;
    }

    this.small = settings.small || false;

    // Monitor global homescreen settings
    if (!navigator.getDataStores) {
      console.error('Datastore API unavailable');
      return;
    }
  }

  Settings.prototype = {
    save: function() {
      localStorage.setItem('settings', JSON.stringify({
        version: SETTINGS_VERSION,
        small: this.small
      }));
    }
  };

  exports.Settings = Settings;

}(window));
