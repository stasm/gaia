'use strict';

/* global require, exports */

var utils = require('./utils');
function execute(options) {
  var file = utils.resolve('apps/system/blank.html', options.GAIA_DIR);
  var document = utils.getDocument(utils.getFileContent(file));

  // this works
  var df = document.createDocumentFragment();
  document.body.appendChild(df);

  var tmpl = document.createElement('template');

  // this doesn't work
  document.body.appendChild(tmpl.content);
  // -> Exception: [Exception... "Unexpected error"  nsresult: "0x8000ffff
  // (NS_ERROR_UNEXPECTED)"  location: "JS frame ::
  // resource://gre/modules/commonjs/toolkit/loader.js ->
  // file:///srv/moz/gaia/build/testcase.js :: execute :: line 17"  data: no]

  // neither does this
  var clone = document.importNode(tmpl.content, true);
  // -> Exception: [Exception... "Unexpected error"  nsresult: "0x8000ffff
  // (NS_ERROR_UNEXPECTED)"  location: "JS frame ::
  // resource://gre/modules/commonjs/toolkit/loader.js ->
  // file:///srv/moz/gaia/build/testcase.js :: execute :: line 24"  data: no]
  document.body.appendChild(clone);
}

exports.execute = execute;
