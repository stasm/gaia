(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _io = __webpack_require__(2);

	var _io2 = _interopRequireWildcard(_io);

	var _Env = __webpack_require__(1);

	var _Env2 = _interopRequireWildcard(_Env);

	var _L10n = __webpack_require__(3);

	var _View = __webpack_require__(4);

	var _getMeta2 = __webpack_require__(5);

	var _changeLanguage$onlanguagechage$onadditionallanguageschange = __webpack_require__(6);

	var additionalLangsAtLaunch = navigator.mozApps.getAdditionalLanguages();
	var readyStates = {
	  loading: 0,
	  interactive: 1,
	  complete: 2
	};

	function whenInteractive(callback) {
	  if (readyStates[document.readyState] >= readyStates.interactive) {
	    return callback();
	  }

	  document.addEventListener('readystatechange', function l10n_onrsc() {
	    if (readyStates[document.readyState] >= readyStates.interactive) {
	      document.removeEventListener('readystatechange', l10n_onrsc);
	      callback();
	    }
	  });
	}

	function init() {
	  var _this = this;

	  var _getMeta = _getMeta2.getMeta(document.head);

	  var defaultLang = _getMeta.defaultLang;
	  var availableLangs = _getMeta.availableLangs;
	  var appVersion = _getMeta.appVersion;

	  this.env = new _Env2['default'](document.URL, _io2['default'].fetch.bind(_io2['default'], appVersion));
	  this.views.push(document.l10n = new _View.View(this, document));

	  this.languages = additionalLangsAtLaunch.then(function (additionalLangs) {
	    return _changeLanguage$onlanguagechage$onadditionallanguageschange.changeLanguage.call(_this, appVersion, defaultLang, availableLangs, additionalLangs, [], navigator.languages);
	  }, _changeLanguage$onlanguagechage$onadditionallanguageschange.changeLanguage.bind(this, appVersion, defaultLang, availableLangs, null, [], navigator.languages));

	  window.addEventListener('languagechange', _changeLanguage$onlanguagechage$onadditionallanguageschange.onlanguagechage.bind(this, appVersion, defaultLang, availableLangs));
	  document.addEventListener('additionallanguageschange', _changeLanguage$onlanguagechage$onadditionallanguageschange.onadditionallanguageschange.bind(this, appVersion, defaultLang, availableLangs));
	}

	whenInteractive(init.bind(navigator.mozL10n = _L10n.L10n));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = Env;

	var _Context = __webpack_require__(11);

	var _Context2 = _interopRequireWildcard(_Context);

	var _Resolver = __webpack_require__(12);

	var _Resolver2 = _interopRequireWildcard(_Resolver);

	'use strict';

	function Env(id, fetch) {
	  this.id = id;
	  this.fetch = fetch;

	  this._resMap = Object.create(null);
	  this._resCache = Object.create(null);
	}

	Env.prototype.createContext = function (resIds) {
	  var ctx = new _Context2['default'](this, resIds);

	  resIds.forEach(function (res) {
	    if (!this._resMap[res]) {
	      this._resMap[res] = new Set();
	    }
	    this._resMap[res].add(ctx);
	  }, this);

	  return ctx;
	};

	Env.prototype.destroyContext = function (ctx) {
	  var cache = this._resCache;
	  var map = this._resMap;

	  ctx._resIds.forEach(function (resId) {
	    if (map[resId].size === 1) {
	      map[resId].clear();
	      delete cache[resId];
	    } else {
	      map[resId]['delete'](ctx);
	    }
	  });
	};

	Env.prototype._getResource = function (lang, res) {
	  var code = lang.code;
	  var src = lang.src;

	  var cache = this._resCache;

	  if (!cache[res]) {
	    cache[res] = Object.create(null);
	    cache[res][code] = Object.create(null);
	  } else if (!cache[res][code]) {
	    cache[res][code] = Object.create(null);
	  } else if (cache[res][code][src]) {
	    return cache[res][code][src];
	  }

	  return cache[res][code][src] = this.fetch(src, res, code).then(function (ast) {
	    return cache[res][code][src] = createEntries(lang, ast);
	  }, function (err) {
	    return cache[res][code][src] = err;
	  });
	};

	function createEntries(lang, ast) {
	  var entries = Object.create(null);
	  for (var i = 0, node; node = ast[i]; i++) {
	    entries[node.$i] = _Resolver2['default'].createEntry(node, lang);
	  }
	  return entries;
	}
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _L10nError = __webpack_require__(7);

	var _PropertiesParser = __webpack_require__(13);

	var _PropertiesParser2 = _interopRequireWildcard(_PropertiesParser);

	'use strict';

	function load(type, url) {
	  return new Promise(function (resolve, reject) {
	    var xhr = new XMLHttpRequest();

	    if (xhr.overrideMimeType) {
	      xhr.overrideMimeType(type);
	    }

	    xhr.open('GET', url, true);

	    if (type === 'application/json') {
	      xhr.responseType = 'json';
	    }

	    xhr.addEventListener('load', function io_onload(e) {
	      if (e.target.status === 200 || e.target.status === 0) {
	        // Sinon.JS's FakeXHR doesn't have the response property
	        resolve(e.target.response || e.target.responseText);
	      } else {
	        reject(new _L10nError.L10nError('Not found: ' + url));
	      }
	    });
	    xhr.addEventListener('error', reject);
	    xhr.addEventListener('timeout', reject);

	    // the app: protocol throws on 404, see https://bugzil.la/827243
	    try {
	      xhr.send(null);
	    } catch (e) {
	      if (e.name === 'NS_ERROR_FILE_NOT_FOUND') {
	        // the app: protocol throws on 404, see https://bugzil.la/827243
	        reject(new _L10nError.L10nError('Not found: ' + url));
	      } else {
	        throw e;
	      }
	    }
	  });
	}

	var io = {
	  extra: function extra(lang, ver, path, type) {
	    if (type === 'properties') {
	      type = 'text';
	    }
	    return navigator.mozApps.getLocalizationResource(lang, ver, path, type);
	  },
	  app: function app(lang, ver, path, type) {
	    switch (type) {
	      case 'properties':
	        return load('text/plain', path);
	      case 'json':
	        return load('application/json', path);
	      default:
	        throw new _L10nError.L10nError('Unknown file type: ' + type);
	    }
	  } };

	var parsers = {
	  properties: _PropertiesParser2['default'].parse.bind(_PropertiesParser2['default'], null),
	  json: null
	};

	exports['default'] = {
	  fetch: function fetch(ver, source, res, lang) {
	    var url = res.replace('{locale}', lang);
	    var type = res.substr(res.lastIndexOf('.') + 1);
	    var raw = io[source](lang, ver, url, type);
	    return parsers[type] ? raw.then(parsers[type]) : raw;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.initViews = initViews;

	var _translateDocument$setL10nAttributes$getL10nAttributes = __webpack_require__(8);

	'use strict';

	var L10n = {
	  env: null,
	  views: [],
	  languages: null,

	  setAttributes: _translateDocument$setL10nAttributes$getL10nAttributes.setL10nAttributes,
	  getAttributes: _translateDocument$setL10nAttributes$getL10nAttributes.getL10nAttributes,

	  // legacy compat
	  readyState: 'complete',
	  language: {
	    code: 'en-US',
	    direction: 'ltr'
	  },
	  qps: {},
	  get: function get(id) {
	    return id;
	  },
	  // XXX temporary
	  _ready: new Promise(function (resolve) {
	    window.addEventListener('l10nready', resolve);
	  }),
	  ready: function ready(callback) {
	    return this._ready.then(callback);
	  },
	  once: function once(callback) {
	    return this._ready.then(callback);
	  }
	};

	exports.L10n = L10n;

	function initViews(langs) {
	  return Promise.all(this.views.map(function (view) {
	    return initView(view, langs);
	  })).then(onReady.bind(this))['catch'](console.error.bind.console);
	}

	function initView(view, langs) {
	  dispatchEvent(view.doc, 'supportedlanguageschange', langs);
	  return view.ctx.fetch(langs, 1);
	}

	function onReady() {
	  // XXX temporary
	  dispatchEvent(window, 'l10nready');

	  function translate(view) {
	    return _translateDocument$setL10nAttributes$getL10nAttributes.translateDocument.call(view, view.doc.documentElement).then(function () {
	      return view.observer.start();
	    });
	  }

	  Promise.all(this.views.map(function (view) {
	    return translate(view);
	  })).then(dispatchEvent.bind(this, window, 'localized'));
	}

	function dispatchEvent(root, name, langs) {
	  var event = new CustomEvent(name, {
	    bubbles: false,
	    cancelable: false,
	    detail: {
	      languages: langs
	    }
	  });
	  root.dispatchEvent(event);
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.View = View;

	var _getResourceLinks = __webpack_require__(5);

	var _MozL10nMutationObserver = __webpack_require__(9);

	var _MozL10nMutationObserver2 = _interopRequireWildcard(_MozL10nMutationObserver);

	'use strict';

	function View(service, doc) {
	  this.service = service;
	  this.doc = doc;

	  this.ctx = this.service.env.createContext(_getResourceLinks.getResourceLinks(doc.head));
	  this.observer = new _MozL10nMutationObserver2['default']();
	}

	View.prototype.formatEntity = function (id, args) {
	  return this.ctx.formatEntity(this.service.languages, id, args);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.getResourceLinks = getResourceLinks;
	exports.getMeta = getMeta;
	'use strict';

	function getResourceLinks(head) {
	  return Array.prototype.map.call(head.querySelectorAll('link[rel="localization"]'), function (el) {
	    return el.getAttribute('href');
	  });
	}

	function getMeta(head) {
	  var availableLangs = Object.create(null);
	  var defaultLang = null;
	  var appVersion = null;

	  // XXX take last found instead of first?
	  var els = head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]');
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = els[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var el = _step.value;

	      var _name = el.getAttribute('name');
	      var content = el.getAttribute('content').trim();
	      switch (_name) {
	        case 'availableLanguages':
	          availableLangs = getLangRevisionMap(availableLangs, content);
	          break;
	        case 'defaultLanguage':
	          var _getLangRevisionTuple = getLangRevisionTuple(content),
	              _getLangRevisionTuple2 = _slicedToArray(_getLangRevisionTuple, 2),
	              lang = _getLangRevisionTuple2[0],
	              rev = _getLangRevisionTuple2[1];

	          defaultLang = lang;
	          if (!(lang in availableLangs)) {
	            availableLangs[lang] = rev;
	          }
	          break;
	        case 'appVersion':
	          appVersion = content;
	      }
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return {
	    defaultLang: defaultLang,
	    availableLangs: availableLangs,
	    appVersion: appVersion
	  };
	}

	function getLangRevisionMap(seq, str) {
	  return str.split(',').reduce(function (seq, cur) {
	    var _getLangRevisionTuple3 = getLangRevisionTuple(cur);

	    var _getLangRevisionTuple32 = _slicedToArray(_getLangRevisionTuple3, 2);

	    var lang = _getLangRevisionTuple32[0];
	    var rev = _getLangRevisionTuple32[1];

	    seq[lang] = rev;
	    return seq;
	  }, seq);
	}

	function getLangRevisionTuple(str) {
	  // code:revision

	  var _str$trim$split = str.trim().split(':');

	  var _str$trim$split2 = _slicedToArray(_str$trim$split, 2);

	  var lang = _str$trim$split2[0];
	  var rev = _str$trim$split2[1];

	  // if revision is missing, use NaN
	  return [lang, parseInt(rev)];
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.onlanguagechage = onlanguagechage;
	exports.onadditionallanguageschange = onadditionallanguageschange;
	exports.changeLanguage = changeLanguage;

	var _prioritizeLocales = __webpack_require__(10);

	var _initViews = __webpack_require__(3);

	'use strict';

	var rtlList = ['ar', 'he', 'fa', 'ps', 'qps-plocm', 'ur'];

	function onlanguagechage(appVersion, defaultLang, availableLangs) {
	  var _this = this;

	  this.languages = Promise.all([navigator.mozApps.getAdditionalLanguages(), this.languages]).then(function (all) {
	    return changeLanguage.call.apply(changeLanguage, [_this, appVersion, defaultLang, availableLangs].concat(_toConsumableArray(all), [navigator.languages]));
	  });
	}

	function onadditionallanguageschange(appVersion, defaultLang, availableLangs, evt) {
	  var _this2 = this;

	  this.languages = this.languages.then(function (prevLangs) {
	    return changeLanguage.call(_this2, appVersion, defaultLang, availableLangs, evt.detail, prevLangs, navigator.languages);
	  });
	}

	function changeLanguage(appVersion, defaultLang, availableLangs, additionalLangs, prevLangs, requestedLangs) {

	  var allAvailableLangs = Object.keys(availableLangs).concat(additionalLangs || []);
	  var newLangs = _prioritizeLocales.prioritizeLocales(defaultLang, allAvailableLangs, requestedLangs);

	  var langs = newLangs.map(function (lang) {
	    return {
	      code: lang,
	      src: getLangSource(appVersion, availableLangs, additionalLangs, lang),
	      dir: getDirection(lang)
	    };
	  });

	  if (!arrEqual(prevLangs, newLangs)) {
	    _initViews.initViews.call(this, langs);
	  }

	  return langs;
	}

	function getDirection(lang) {
	  return rtlList.indexOf(lang) >= 0 ? 'rtl' : 'ltr';
	}

	function arrEqual(arr1, arr2) {
	  return arr1.length === arr2.length && arr1.every(function (elem, i) {
	    return elem === arr2[i];
	  });
	}

	function getMatchingLangpack(appVersion, langpacks) {
	  for (var i = 0, langpack; langpack = langpacks[i]; i++) {
	    if (langpack.target === appVersion) {
	      return langpack;
	    }
	  }
	  return null;
	}

	function getLangSource(appVersion, availableLangs, additionalLangs, lang) {
	  if (additionalLangs && additionalLangs[lang]) {
	    var lp = getMatchingLangpack(appVersion, additionalLangs[lang]);
	    if (lp && (!(lang in availableLangs) || parseInt(lp.revision) > availableLangs[lang])) {
	      return 'extra';
	    }
	  }

	  return 'app';
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.L10nError = L10nError;
	'use strict';

	function L10nError(message, id, loc) {
	  this.name = 'L10nError';
	  this.message = message;
	  this.id = id;
	  this.loc = loc;
	}

	L10nError.prototype = Object.create(Error.prototype);
	L10nError.prototype.constructor = L10nError;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.setL10nAttributes = setL10nAttributes;
	exports.getL10nAttributes = getL10nAttributes;
	exports.translateDocument = translateDocument;
	exports.translateFragment = translateFragment;
	exports.translateElement = translateElement;

	var _allowed = __webpack_require__(15);

	var _allowed2 = _interopRequireWildcard(_allowed);

	'use strict';

	function setL10nAttributes(element, id, args) {
	  element.setAttribute('data-l10n-id', id);
	  if (args) {
	    element.setAttribute('data-l10n-args', JSON.stringify(args));
	  }
	}

	function getL10nAttributes(element) {
	  return {
	    id: element.getAttribute('data-l10n-id'),
	    args: JSON.parse(element.getAttribute('data-l10n-args'))
	  };
	}

	function getTranslatables(element) {
	  var nodes = [];

	  if (element.hasAttribute('data-l10n-id')) {
	    nodes.push(element);
	  }

	  return nodes.concat.apply(nodes, element.querySelectorAll('*[data-l10n-id]'));
	}

	function translateDocument(doc) {
	  // XXX remove the global
	  document.documentElement.lang = navigator.mozL10n.language.code;
	  document.documentElement.dir = navigator.mozL10n.language.direction;
	  return translateFragment.call(this, doc);
	}

	function translateFragment(element) {
	  return Promise.all(getTranslatables(element).map(translateElement.bind(this)));
	}

	function camelCaseToDashed(string) {
	  // XXX workaround for https://bugzil.la/1141934
	  if (string === 'ariaValueText') {
	    return 'aria-valuetext';
	  }

	  return string.replace(/[A-Z]/g, function (match) {
	    return '-' + match.toLowerCase();
	  }).replace(/^-/, '');
	}

	function translateElement(element) {
	  var l10n = getL10nAttributes(element);

	  if (!l10n.id) {
	    return false;
	  }

	  return this.formatEntity(l10n.id, l10n.args).then(applyTranslation.bind(this, element));
	}

	function applyTranslation(element, entity) {
	  this.observer.stop();

	  var value;
	  if (entity.attrs && entity.attrs.innerHTML) {
	    // XXX innerHTML is treated as value (https://bugzil.la/1142526)
	    value = entity.attrs.innerHTML;
	    console.warn('L10n Deprecation Warning: using innerHTML in translations is unsafe ' + 'and will not be supported in future versions of l10n.js. ' + 'See https://bugzil.la/1027117');
	  } else {
	    value = entity.value;
	  }

	  if (typeof value === 'string') {
	    if (!entity.overlay) {
	      element.textContent = value;
	    } else {
	      // start with an inert template element and move its children into
	      // `element` but such that `element`'s own children are not replaced
	      var translation = element.ownerDocument.createElement('template');
	      translation.innerHTML = value;
	      // overlay the node with the DocumentFragment
	      overlayElement(element, translation.content);
	    }
	  }

	  for (var key in entity.attrs) {
	    var attrName = camelCaseToDashed(key);
	    if (isAttrAllowed({ name: attrName }, element)) {
	      element.setAttribute(attrName, entity.attrs[key]);
	    }
	  }

	  this.observer.start();
	}

	// The goal of overlayElement is to move the children of `translationElement`
	// into `sourceElement` such that `sourceElement`'s own children are not
	// replaced, but onle have their text nodes and their attributes modified.
	//
	// We want to make it possible for localizers to apply text-level semantics to
	// the translations and make use of HTML entities. At the same time, we
	// don't trust translations so we need to filter unsafe elements and
	// attribtues out and we don't want to break the Web by replacing elements to
	// which third-party code might have created references (e.g. two-way
	// bindings in MVC frameworks).
	function overlayElement(sourceElement, translationElement) {
	  var result = translationElement.ownerDocument.createDocumentFragment();
	  var k, attr;

	  // take one node from translationElement at a time and check it against
	  // the allowed list or try to match it with a corresponding element
	  // in the source
	  var childElement;
	  while (childElement = translationElement.childNodes[0]) {
	    translationElement.removeChild(childElement);

	    if (childElement.nodeType === Node.TEXT_NODE) {
	      result.appendChild(childElement);
	      continue;
	    }

	    var index = getIndexOfType(childElement);
	    var sourceChild = getNthElementOfType(sourceElement, childElement, index);
	    if (sourceChild) {
	      // there is a corresponding element in the source, let's use it
	      overlayElement(sourceChild, childElement);
	      result.appendChild(sourceChild);
	      continue;
	    }

	    if (isElementAllowed(childElement)) {
	      for (k = 0, attr; attr = childElement.attributes[k]; k++) {
	        if (!isAttrAllowed(attr, childElement)) {
	          childElement.removeAttribute(attr.name);
	        }
	      }
	      result.appendChild(childElement);
	      continue;
	    }

	    // otherwise just take this child's textContent
	    result.appendChild(document.createTextNode(childElement.textContent));
	  }

	  // clear `sourceElement` and append `result` which by this time contains
	  // `sourceElement`'s original children, overlayed with translation
	  sourceElement.textContent = '';
	  sourceElement.appendChild(result);

	  // if we're overlaying a nested element, translate the allowed
	  // attributes; top-level attributes are handled in `translateElement`
	  // XXX attributes previously set here for another language should be
	  // cleared if a new language doesn't use them; https://bugzil.la/922577
	  if (translationElement.attributes) {
	    for (k = 0, attr; attr = translationElement.attributes[k]; k++) {
	      if (isAttrAllowed(attr, sourceElement)) {
	        sourceElement.setAttribute(attr.name, attr.value);
	      }
	    }
	  }
	}

	// XXX the allowed list should be amendable; https://bugzil.la/922573
	function isElementAllowed(element) {
	  return _allowed2['default'].elements.indexOf(element.tagName.toLowerCase()) !== -1;
	}

	function isAttrAllowed(attr, element) {
	  var attrName = attr.name.toLowerCase();
	  var tagName = element.tagName.toLowerCase();
	  // is it a globally safe attribute?
	  if (_allowed2['default'].attributes.global.indexOf(attrName) !== -1) {
	    return true;
	  }
	  // are there no allowed attributes for this element?
	  if (!_allowed2['default'].attributes[tagName]) {
	    return false;
	  }
	  // is it allowed on this element?
	  // XXX the allowed list should be amendable; https://bugzil.la/922573
	  if (_allowed2['default'].attributes[tagName].indexOf(attrName) !== -1) {
	    return true;
	  }
	  // special case for value on inputs with type button, reset, submit
	  if (tagName === 'input' && attrName === 'value') {
	    var type = element.type.toLowerCase();
	    if (type === 'submit' || type === 'button' || type === 'reset') {
	      return true;
	    }
	  }
	  return false;
	}

	// Get n-th immediate child of context that is of the same type as element.
	// XXX Use querySelector(':scope > ELEMENT:nth-of-type(index)'), when:
	// 1) :scope is widely supported in more browsers and 2) it works with
	// DocumentFragments.
	function getNthElementOfType(context, element, index) {
	  /* jshint boss:true */
	  var nthOfType = 0;
	  for (var i = 0, child; child = context.children[i]; i++) {
	    if (child.nodeType === Node.ELEMENT_NODE && child.tagName === element.tagName) {
	      if (nthOfType === index) {
	        return child;
	      }
	      nthOfType++;
	    }
	  }
	  return null;
	}

	// Get the index of the element among siblings of the same type.
	function getIndexOfType(element) {
	  var index = 0;
	  var child;
	  while (child = element.previousElementSibling) {
	    if (child.tagName === element.tagName) {
	      index++;
	    }
	  }
	  return index;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = MozL10nMutationObserver;

	var _translateFragment$translateElement = __webpack_require__(8);

	'use strict';

	function MozL10nMutationObserver() {
	  this._observer = null;
	}

	MozL10nMutationObserver.prototype.start = function () {
	  if (!this._observer) {
	    this._observer = new MutationObserver(onMutations.bind(document.l10n));
	  }
	  return this._observer.observe(document, this.CONFIG);
	};

	MozL10nMutationObserver.prototype.stop = function () {
	  return this._observer && this._observer.disconnect();
	};

	MozL10nMutationObserver.prototype.CONFIG = {
	  attributes: true,
	  characterData: false,
	  childList: true,
	  subtree: true,
	  attributeFilter: ['data-l10n-id', 'data-l10n-args']
	};

	function onMutations(mutations) {
	  var mutation;
	  var targets = new Set();

	  for (var i = 0; i < mutations.length; i++) {
	    mutation = mutations[i];
	    if (mutation.type === 'childList') {
	      var addedNode;

	      for (var j = 0; j < mutation.addedNodes.length; j++) {
	        addedNode = mutation.addedNodes[j];

	        if (addedNode.nodeType !== Node.ELEMENT_NODE) {
	          continue;
	        }

	        targets.add(addedNode);
	      }
	    }

	    if (mutation.type === 'attributes') {
	      _translateFragment$translateElement.translateElement.call(this, mutation.target);
	    }
	  }

	  targets.forEach(function (target) {
	    if (target.childElementCount) {
	      _translateFragment$translateElement.translateFragment.call(this, target);
	    } else if (target.hasAttribute('data-l10n-id')) {
	      _translateFragment$translateElement.translateElement.call(this, target);
	    }
	  }, this);
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.prioritizeLocales = prioritizeLocales;
	'use strict';

	function prioritizeLocales(def, availableLangs, requested) {
	  var supportedLocale;
	  // Find the first locale in the requested list that is supported.
	  for (var i = 0; i < requested.length; i++) {
	    var locale = requested[i];
	    if (availableLangs.indexOf(locale) !== -1) {
	      supportedLocale = locale;
	      break;
	    }
	  }
	  if (!supportedLocale || supportedLocale === def) {
	    return [def];
	  }

	  return [supportedLocale, def];
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = Context;

	var _L10nError = __webpack_require__(7);

	var _Resolver = __webpack_require__(12);

	var _Resolver2 = _interopRequireWildcard(_Resolver);

	var _getPluralRule = __webpack_require__(16);

	var _getPluralRule2 = _interopRequireWildcard(_getPluralRule);

	'use strict';

	function Context(env, resIds) {
	  this._env = env;
	  this._resIds = resIds;
	}

	Context.prototype.fetch = function (langs) {
	  // XXX add arg: count of langs to fetch
	  return Promise.resolve(langs).then(this._fetchResources.bind(this));
	};

	Context.prototype._formatTuple = function (args, entity) {
	  try {
	    return _Resolver2['default'].format(this, args, entity);
	  } catch (err) {
	    return [{ error: err }, entity.id];
	  }
	};

	Context.prototype._formatValue = function (args, entity) {
	  if (typeof entity === 'string') {
	    return entity;
	  }

	  // take the string value only
	  return this._formatTuple.call(this, args, entity)[1];
	};

	Context.prototype._formatEntity = function (args, entity) {
	  var _formatTuple$call = this._formatTuple.call(this, args, entity);

	  var _formatTuple$call2 = _slicedToArray(_formatTuple$call, 2);

	  var locals = _formatTuple$call2[0];
	  var value = _formatTuple$call2[1];

	  var formatted = {
	    value: value,
	    attrs: null,
	    overlay: locals.overlay
	  };

	  if (entity.attrs) {
	    formatted.attrs = Object.create(null);
	  }

	  for (var key in entity.attrs) {
	    /* jshint -W089 */

	    var _formatTuple$call3 = this._formatTuple.call(this, args, entity.attrs[key]);

	    var _formatTuple$call32 = _slicedToArray(_formatTuple$call3, 2);

	    var attrLocals = _formatTuple$call32[0];
	    var attrValue = _formatTuple$call32[1];

	    formatted.attrs[key] = attrValue;
	    if (attrLocals.overlay) {
	      formatted.overlay = true;
	    }
	  }

	  return formatted;
	};

	Context.prototype.formatEntity = function (langs, id, args) {
	  return this.fetch(langs).then(this._fallback.bind(this, Context.prototype._formatEntity, id, args));
	};

	Context.prototype.destroy = function () {
	  this._env.destroyContext(this);
	};

	Context.prototype._fetchResources = function (langs) {
	  if (langs.length === 0) {
	    return Promise.reject(new _L10nError.L10nError('No more supported languages to try'));
	  }

	  return Promise.all(this._resIds.map(this._env._getResource.bind(this._env, langs[0]))).then(function () {
	    return langs;
	  });
	};

	Context.prototype._fallback = function (method, id, args, langs) {
	  var lang = langs[0];

	  var entity = this._getEntity(lang, id);

	  if (entity) {
	    try {
	      return method.call(this, args, entity);
	    } catch (e) {
	      console.error(id, ' in ', lang.code, ' is broken: ', e);
	    }
	  } else {
	    console.error(id, ' missing from ', lang.code);
	  }

	  return this._fetchResources(langs.slice(1)).then(this._fallback.bind(this, method, id, args), function (err) {
	    console.error(err);return id;
	  });
	};

	Context.prototype._getEntity = function (lang, id) {
	  var cache = this._env._resCache;

	  // Look for `id` in every resource in order.
	  for (var i = 0, resId; resId = this._resIds[i]; i++) {
	    var resource = cache[resId][lang.code][lang.src];
	    if (resource instanceof _L10nError.L10nError) {
	      continue;
	    }
	    if (id in resource) {
	      return resource[id];
	    }
	  }
	  return undefined;
	};

	// XXX in the future macros will be stored in localization resources together
	// with regular entities and this method will not be needed anymore
	Context.prototype._getMacro = function (lang, id) {
	  switch (id) {
	    case 'plural':
	      return _getPluralRule2['default'](lang.code);
	    default:
	      return undefined;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _L10nError = __webpack_require__(7);

	'use strict';

	var KNOWN_MACROS = ['plural'];
	var MAX_PLACEABLE_LENGTH = 2500;
	var rePlaceables = /\{\{\s*(.+?)\s*\}\}/g;

	function createEntry(node, lang) {
	  var keys = Object.keys(node);

	  // the most common scenario: a simple string with no arguments
	  if (typeof node.$v === 'string' && keys.length === 2) {
	    return node.$v;
	  }

	  var attrs;

	  for (var i = 0, key; key = keys[i]; i++) {
	    // skip $i (id), $v (value), $x (index)
	    if (key[0] === '$') {
	      continue;
	    }

	    if (!attrs) {
	      attrs = Object.create(null);
	    }
	    attrs[key] = createAttribute(node[key], lang, node.$i + '.' + key);
	  }

	  return {
	    id: node.$i,
	    value: node.$v !== undefined ? node.$v : null,
	    index: node.$x || null,
	    attrs: attrs || null,
	    lang: lang,
	    // the dirty guard prevents cyclic or recursive references
	    dirty: false
	  };
	}

	function createAttribute(node, lang, id) {
	  if (typeof node === 'string') {
	    return node;
	  }

	  return {
	    id: id,
	    value: node.$v || (node !== undefined ? node : null),
	    index: node.$x || null,
	    lang: lang,
	    dirty: false
	  };
	}

	function format(ctx, args, entity) {
	  var locals = {
	    overlay: false
	  };

	  if (typeof entity === 'string') {
	    return [locals, entity];
	  }

	  if (entity.dirty) {
	    throw new _L10nError.L10nError('Cyclic reference detected: ' + entity.id);
	  }

	  entity.dirty = true;

	  var rv;

	  // if format fails, we want the exception to bubble up and stop the whole
	  // resolving process;  however, we still need to clean up the dirty flag
	  try {
	    rv = resolveValue(locals, ctx, entity.lang, args, entity.value, entity.index);
	  } finally {
	    entity.dirty = false;
	  }
	  return rv;
	}

	function resolveIdentifier(ctx, lang, args, id) {
	  if (KNOWN_MACROS.indexOf(id) > -1) {
	    return [{}, ctx._getMacro(lang, id)];
	  }

	  if (args && args.hasOwnProperty(id)) {
	    if (typeof args[id] === 'string' || typeof args[id] === 'number' && !isNaN(args[id])) {
	      return [{}, args[id]];
	    } else {
	      throw new _L10nError.L10nError('Arg must be a string or a number: ' + id);
	    }
	  }

	  // XXX: special case for Node.js where still:
	  // '__proto__' in Object.create(null) => true
	  if (id === '__proto__') {
	    throw new _L10nError.L10nError('Illegal id: ' + id);
	  }

	  var entity = ctx._getEntity(lang, id);

	  if (entity) {
	    return format(ctx, args, entity);
	  }

	  throw new _L10nError.L10nError('Unknown reference: ' + id);
	}

	function subPlaceable(ctx, lang, args, id) {
	  var res;

	  try {
	    res = resolveIdentifier(ctx, lang, args, id);
	  } catch (err) {
	    return [{ error: err }, '{{ ' + id + ' }}'];
	  }

	  var value = res[1];

	  if (typeof value === 'number') {
	    return res;
	  }

	  if (typeof value === 'string') {
	    // prevent Billion Laughs attacks
	    if (value.length >= MAX_PLACEABLE_LENGTH) {
	      throw new _L10nError.L10nError('Too many characters in placeable (' + value.length + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')');
	    }
	    return res;
	  }

	  return [{}, '{{ ' + id + ' }}'];
	}

	function interpolate(locals, ctx, lang, args, arr) {
	  return arr.reduce(function (prev, cur) {
	    if (typeof cur === 'string') {
	      return [prev[0], prev[1] + cur];
	    } else if (cur.t === 'idOrVar') {
	      var placeable = subPlaceable(ctx, lang, args, cur.v);
	      if (placeable[0].overlay) {
	        prev[0].overlay = true;
	      }
	      return [prev[0], prev[1] + placeable[1]];
	    }
	  }, [locals, '']);
	}

	function resolveSelector(ctx, lang, args, expr, index) {
	  var selectorName = index[0].v;
	  var selector = resolveIdentifier(ctx, lang, args, selectorName)[1];

	  if (typeof selector !== 'function') {
	    // selector is a simple reference to an entity or args
	    return selector;
	  }

	  var argValue = index[1] ? resolveIdentifier(ctx, lang, args, index[1])[1] : undefined;

	  if (selector === ctx._getMacro(lang, 'plural')) {
	    // special cases for zero, one, two if they are defined on the hash
	    if (argValue === 0 && 'zero' in expr) {
	      return 'zero';
	    }
	    if (argValue === 1 && 'one' in expr) {
	      return 'one';
	    }
	    if (argValue === 2 && 'two' in expr) {
	      return 'two';
	    }
	  }

	  return selector(argValue);
	}

	function resolveValue(_x, _x2, _x3, _x4, _x5, _x6) {
	  var _again = true;

	  _function: while (_again) {
	    selector = undefined;
	    _again = false;
	    var locals = _x,
	        ctx = _x2,
	        lang = _x3,
	        args = _x4,
	        expr = _x5,
	        index = _x6;

	    if (!expr) {
	      return [locals, expr];
	    }

	    if (expr.$o) {
	      expr = expr.$o;
	      locals.overlay = true;
	    }

	    if (typeof expr === 'string' || typeof expr === 'boolean' || typeof expr === 'number') {
	      return [locals, expr];
	    }

	    if (Array.isArray(expr)) {
	      return interpolate(locals, ctx, lang, args, expr);
	    }

	    // otherwise, it's a dict
	    if (index) {
	      // try to use the index in order to select the right dict member
	      var selector = resolveSelector(ctx, lang, args, expr, index);
	      if (expr.hasOwnProperty(selector)) {
	        _x = locals;
	        _x2 = ctx;
	        _x3 = lang;
	        _x4 = args;
	        _x5 = expr[selector];
	        _again = true;
	        continue _function;
	      }
	    }

	    // if there was no index or no selector was found, try 'other'
	    if ('other' in expr) {
	      _x = locals;
	      _x2 = ctx;
	      _x3 = lang;
	      _x4 = args;
	      _x5 = expr.other;
	      _again = true;
	      continue _function;
	    }

	    // XXX Specify entity id
	    throw new _L10nError.L10nError('Unresolvable value');
	  }
	}

	exports['default'] = { createEntry: createEntry, format: format, rePlaceables: rePlaceables };
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _L10nError = __webpack_require__(7);

	var _unescape = __webpack_require__(14);

	'use strict';

	var MAX_PLACEABLES = 100;

	exports['default'] = {
	  patterns: null,
	  entryIds: null,

	  init: function init() {
	    this.patterns = {
	      comment: /^\s*#|^\s*$/,
	      entity: /^([^=\s]+)\s*=\s*(.*)$/,
	      multiline: /[^\\]\\$/,
	      index: /\{\[\s*(\w+)(?:\(([^\)]*)\))?\s*\]\}/i,
	      unicode: /\\u([0-9a-fA-F]{1,4})/g,
	      entries: /[^\r\n]+/g,
	      controlChars: /\\([\\\n\r\t\b\f\{\}\"\'])/g,
	      placeables: /\{\{\s*([^\s]*?)\s*\}\}/ };
	  },

	  parse: function parse(ctx, source) {
	    if (!this.patterns) {
	      this.init();
	    }

	    var ast = [];
	    this.entryIds = Object.create(null);

	    var entries = source.match(this.patterns.entries);
	    if (!entries) {
	      return ast;
	    }
	    for (var i = 0; i < entries.length; i++) {
	      var line = entries[i];

	      if (this.patterns.comment.test(line)) {
	        continue;
	      }

	      while (this.patterns.multiline.test(line) && i < entries.length) {
	        line = line.slice(0, -1) + entries[++i].trim();
	      }

	      var entityMatch = line.match(this.patterns.entity);
	      if (entityMatch) {
	        try {
	          this.parseEntity(entityMatch[1], entityMatch[2], ast);
	        } catch (e) {
	          if (ctx) {
	            ctx._emitter.emit('parseerror', e);
	          } else {
	            throw e;
	          }
	        }
	      }
	    }
	    return ast;
	  },

	  parseEntity: function parseEntity(id, value, ast) {
	    var name, key;

	    var pos = id.indexOf('[');
	    if (pos !== -1) {
	      name = id.substr(0, pos);
	      key = id.substring(pos + 1, id.length - 1);
	    } else {
	      name = id;
	      key = null;
	    }

	    var nameElements = name.split('.');

	    if (nameElements.length > 2) {
	      throw new _L10nError.L10nError('Error in ID: "' + name + '".' + ' Nested attributes are not supported.');
	    }

	    var attr;
	    if (nameElements.length > 1) {
	      name = nameElements[0];
	      attr = nameElements[1];

	      if (attr[0] === '$') {
	        throw new _L10nError.L10nError('Attribute can\'t start with "$"', id);
	      }
	    } else {
	      attr = null;
	    }

	    this.setEntityValue(name, attr, key, this.unescapeString(value), ast);
	  },

	  setEntityValue: function setEntityValue(id, attr, key, rawValue, ast) {
	    var pos, v;

	    var value = rawValue.indexOf('{{') > -1 ? this.parseString(rawValue) : rawValue;

	    if (rawValue.indexOf('<') > -1 || rawValue.indexOf('&') > -1) {
	      value = { $o: value };
	    }

	    if (attr) {
	      pos = this.entryIds[id];
	      if (pos === undefined) {
	        v = { $i: id };
	        if (key) {
	          v[attr] = {};
	          v[attr][key] = value;
	        } else {
	          v[attr] = value;
	        }
	        ast.push(v);
	        this.entryIds[id] = ast.length - 1;
	        return;
	      }
	      if (key) {
	        if (typeof ast[pos][attr] === 'string') {
	          ast[pos][attr] = {
	            $x: this.parseIndex(ast[pos][attr]),
	            $v: {}
	          };
	        }
	        ast[pos][attr].$v[key] = value;
	        return;
	      }
	      ast[pos][attr] = value;
	      return;
	    }

	    // Hash value
	    if (key) {
	      pos = this.entryIds[id];
	      if (pos === undefined) {
	        v = {};
	        v[key] = value;
	        ast.push({ $i: id, $v: v });
	        this.entryIds[id] = ast.length - 1;
	        return;
	      }
	      if (typeof ast[pos].$v === 'string') {
	        ast[pos].$x = this.parseIndex(ast[pos].$v);
	        ast[pos].$v = {};
	      }
	      ast[pos].$v[key] = value;
	      return;
	    }

	    // simple value
	    ast.push({ $i: id, $v: value });
	    this.entryIds[id] = ast.length - 1;
	  },

	  parseString: function parseString(str) {
	    var chunks = str.split(this.patterns.placeables);
	    var complexStr = [];

	    var len = chunks.length;
	    var placeablesCount = (len - 1) / 2;

	    if (placeablesCount >= MAX_PLACEABLES) {
	      throw new _L10nError.L10nError('Too many placeables (' + placeablesCount + ', max allowed is ' + MAX_PLACEABLES + ')');
	    }

	    for (var i = 0; i < chunks.length; i++) {
	      if (chunks[i].length === 0) {
	        continue;
	      }
	      if (i % 2 === 1) {
	        complexStr.push({ t: 'idOrVar', v: chunks[i] });
	      } else {
	        complexStr.push(chunks[i]);
	      }
	    }
	    return complexStr;
	  },

	  unescapeString: function unescapeString(str) {
	    if (str.lastIndexOf('\\') !== -1) {
	      str = str.replace(this.patterns.controlChars, '$1');
	    }
	    return str.replace(this.patterns.unicode, function (match, token) {
	      return _unescape.unescape('%u' + '0000'.slice(token.length) + token);
	    });
	  },

	  parseIndex: function parseIndex(str) {
	    var match = str.match(this.patterns.index);
	    if (!match) {
	      throw new _L10nError.L10nError('Malformed index');
	    }
	    if (match[2]) {
	      return [{ t: 'idOrVar', v: match[1] }, match[2]];
	    } else {
	      return [{ t: 'idOrVar', v: match[1] }];
	    }
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = window;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	'use strict';

	exports['default'] = {
	  elements: ['a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr'],
	  attributes: {
	    global: ['title', 'aria-label', 'aria-valuetext', 'aria-moz-hint'],
	    a: ['download'],
	    area: ['download', 'alt'],
	    // value is special-cased in isAttrAllowed
	    input: ['alt', 'placeholder'],
	    menuitem: ['label'],
	    menu: ['label'],
	    optgroup: ['label'],
	    option: ['label'],
	    track: ['label'],
	    img: ['alt'],
	    textarea: ['placeholder'],
	    th: ['abbr']
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getPluralRule;
	'use strict';

	function getPluralRule(lang) {
	  var locales2rules = {
	    af: 3,
	    ak: 4,
	    am: 4,
	    ar: 1,
	    asa: 3,
	    az: 0,
	    be: 11,
	    bem: 3,
	    bez: 3,
	    bg: 3,
	    bh: 4,
	    bm: 0,
	    bn: 3,
	    bo: 0,
	    br: 20,
	    brx: 3,
	    bs: 11,
	    ca: 3,
	    cgg: 3,
	    chr: 3,
	    cs: 12,
	    cy: 17,
	    da: 3,
	    de: 3,
	    dv: 3,
	    dz: 0,
	    ee: 3,
	    el: 3,
	    en: 3,
	    eo: 3,
	    es: 3,
	    et: 3,
	    eu: 3,
	    fa: 0,
	    ff: 5,
	    fi: 3,
	    fil: 4,
	    fo: 3,
	    fr: 5,
	    fur: 3,
	    fy: 3,
	    ga: 8,
	    gd: 24,
	    gl: 3,
	    gsw: 3,
	    gu: 3,
	    guw: 4,
	    gv: 23,
	    ha: 3,
	    haw: 3,
	    he: 2,
	    hi: 4,
	    hr: 11,
	    hu: 0,
	    id: 0,
	    ig: 0,
	    ii: 0,
	    is: 3,
	    it: 3,
	    iu: 7,
	    ja: 0,
	    jmc: 3,
	    jv: 0,
	    ka: 0,
	    kab: 5,
	    kaj: 3,
	    kcg: 3,
	    kde: 0,
	    kea: 0,
	    kk: 3,
	    kl: 3,
	    km: 0,
	    kn: 0,
	    ko: 0,
	    ksb: 3,
	    ksh: 21,
	    ku: 3,
	    kw: 7,
	    lag: 18,
	    lb: 3,
	    lg: 3,
	    ln: 4,
	    lo: 0,
	    lt: 10,
	    lv: 6,
	    mas: 3,
	    mg: 4,
	    mk: 16,
	    ml: 3,
	    mn: 3,
	    mo: 9,
	    mr: 3,
	    ms: 0,
	    mt: 15,
	    my: 0,
	    nah: 3,
	    naq: 7,
	    nb: 3,
	    nd: 3,
	    ne: 3,
	    nl: 3,
	    nn: 3,
	    no: 3,
	    nr: 3,
	    nso: 4,
	    ny: 3,
	    nyn: 3,
	    om: 3,
	    or: 3,
	    pa: 3,
	    pap: 3,
	    pl: 13,
	    ps: 3,
	    pt: 3,
	    rm: 3,
	    ro: 9,
	    rof: 3,
	    ru: 11,
	    rwk: 3,
	    sah: 0,
	    saq: 3,
	    se: 7,
	    seh: 3,
	    ses: 0,
	    sg: 0,
	    sh: 11,
	    shi: 19,
	    sk: 12,
	    sl: 14,
	    sma: 7,
	    smi: 7,
	    smj: 7,
	    smn: 7,
	    sms: 7,
	    sn: 3,
	    so: 3,
	    sq: 3,
	    sr: 11,
	    ss: 3,
	    ssy: 3,
	    st: 3,
	    sv: 3,
	    sw: 3,
	    syr: 3,
	    ta: 3,
	    te: 3,
	    teo: 3,
	    th: 0,
	    ti: 4,
	    tig: 3,
	    tk: 3,
	    tl: 4,
	    tn: 3,
	    to: 0,
	    tr: 0,
	    ts: 3,
	    tzm: 22,
	    uk: 11,
	    ur: 3,
	    ve: 3,
	    vi: 0,
	    vun: 3,
	    wa: 4,
	    wae: 3,
	    wo: 0,
	    xh: 3,
	    xog: 3,
	    yo: 0,
	    zh: 0,
	    zu: 3
	  };

	  // utility functions for plural rules methods
	  function isIn(n, list) {
	    return list.indexOf(n) !== -1;
	  }
	  function isBetween(n, start, end) {
	    return typeof n === typeof start && start <= n && n <= end;
	  }

	  // list of all plural rules methods:
	  // map an integer to the plural form name to use
	  var pluralRules = {
	    '0': function _() {
	      return 'other';
	    },
	    '1': function _(n) {
	      if (isBetween(n % 100, 3, 10)) {
	        return 'few';
	      }
	      if (n === 0) {
	        return 'zero';
	      }
	      if (isBetween(n % 100, 11, 99)) {
	        return 'many';
	      }
	      if (n === 2) {
	        return 'two';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '2': function _(n) {
	      if (n !== 0 && n % 10 === 0) {
	        return 'many';
	      }
	      if (n === 2) {
	        return 'two';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '3': function _(n) {
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '4': function _(n) {
	      if (isBetween(n, 0, 1)) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '5': function _(n) {
	      if (isBetween(n, 0, 2) && n !== 2) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '6': function _(n) {
	      if (n === 0) {
	        return 'zero';
	      }
	      if (n % 10 === 1 && n % 100 !== 11) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '7': function _(n) {
	      if (n === 2) {
	        return 'two';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '8': function _(n) {
	      if (isBetween(n, 3, 6)) {
	        return 'few';
	      }
	      if (isBetween(n, 7, 10)) {
	        return 'many';
	      }
	      if (n === 2) {
	        return 'two';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '9': function _(n) {
	      if (n === 0 || n !== 1 && isBetween(n % 100, 1, 19)) {
	        return 'few';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '10': function _(n) {
	      if (isBetween(n % 10, 2, 9) && !isBetween(n % 100, 11, 19)) {
	        return 'few';
	      }
	      if (n % 10 === 1 && !isBetween(n % 100, 11, 19)) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '11': function _(n) {
	      if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) {
	        return 'few';
	      }
	      if (n % 10 === 0 || isBetween(n % 10, 5, 9) || isBetween(n % 100, 11, 14)) {
	        return 'many';
	      }
	      if (n % 10 === 1 && n % 100 !== 11) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '12': function _(n) {
	      if (isBetween(n, 2, 4)) {
	        return 'few';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '13': function _(n) {
	      if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) {
	        return 'few';
	      }
	      if (n !== 1 && isBetween(n % 10, 0, 1) || isBetween(n % 10, 5, 9) || isBetween(n % 100, 12, 14)) {
	        return 'many';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '14': function _(n) {
	      if (isBetween(n % 100, 3, 4)) {
	        return 'few';
	      }
	      if (n % 100 === 2) {
	        return 'two';
	      }
	      if (n % 100 === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '15': function _(n) {
	      if (n === 0 || isBetween(n % 100, 2, 10)) {
	        return 'few';
	      }
	      if (isBetween(n % 100, 11, 19)) {
	        return 'many';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '16': function _(n) {
	      if (n % 10 === 1 && n !== 11) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '17': function _(n) {
	      if (n === 3) {
	        return 'few';
	      }
	      if (n === 0) {
	        return 'zero';
	      }
	      if (n === 6) {
	        return 'many';
	      }
	      if (n === 2) {
	        return 'two';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '18': function _(n) {
	      if (n === 0) {
	        return 'zero';
	      }
	      if (isBetween(n, 0, 2) && n !== 0 && n !== 2) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '19': function _(n) {
	      if (isBetween(n, 2, 10)) {
	        return 'few';
	      }
	      if (isBetween(n, 0, 1)) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '20': function _(n) {
	      if ((isBetween(n % 10, 3, 4) || n % 10 === 9) && !(isBetween(n % 100, 10, 19) || isBetween(n % 100, 70, 79) || isBetween(n % 100, 90, 99))) {
	        return 'few';
	      }
	      if (n % 1000000 === 0 && n !== 0) {
	        return 'many';
	      }
	      if (n % 10 === 2 && !isIn(n % 100, [12, 72, 92])) {
	        return 'two';
	      }
	      if (n % 10 === 1 && !isIn(n % 100, [11, 71, 91])) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '21': function _(n) {
	      if (n === 0) {
	        return 'zero';
	      }
	      if (n === 1) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '22': function _(n) {
	      if (isBetween(n, 0, 1) || isBetween(n, 11, 99)) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '23': function _(n) {
	      if (isBetween(n % 10, 1, 2) || n % 20 === 0) {
	        return 'one';
	      }
	      return 'other';
	    },
	    '24': function _(n) {
	      if (isBetween(n, 3, 10) || isBetween(n, 13, 19)) {
	        return 'few';
	      }
	      if (isIn(n, [2, 12])) {
	        return 'two';
	      }
	      if (isIn(n, [1, 11])) {
	        return 'one';
	      }
	      return 'other';
	    }
	  };

	  // return a function that gives the plural form name for a given integer
	  var index = locales2rules[lang.replace(/-.*$/, '')];
	  if (!(index in pluralRules)) {
	    return function () {
	      return 'other';
	    };
	  }
	  return pluralRules[index];
	}

	module.exports = exports['default'];

/***/ }
/******/ ])));