(function(window) {
  'use strict';

  // this works
  const foo = 'Foo';
  let fn = (...args) => args;

  // this throws a SyntaxError: class is a reserved identifier
  class MyClass {
    constructor(id) {
      this.id = id;
      this.foo = foo;
      this.fn = fn;
    }
  }

  window.myClass = new MyClass(1);

})(this);
