'use strict';

require('/shared/js/myclass.js');

suite('MyClass', function() {
  test('has been instantiated', function() {
    assert(window.myClass.id);
  });
});
