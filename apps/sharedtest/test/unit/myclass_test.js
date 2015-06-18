'use strict';

require('/shared/js/myclass.js', {
  type: 'application/javascript;version=1.8'
});

suite('MyClass', function() {
  test('has been instantiated', function() {
    assert(window.myClass.id);
  });
});
