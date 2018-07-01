/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _getAPI = __webpack_require__(/*! ./utilities/getAPI */ \"./src/utilities/getAPI.js\");\n\nvar _getAPI2 = _interopRequireDefault(_getAPI);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar countries = {};\n(0, _getAPI2.default)(\"https://free.currencyconverterapi.com/api/v5/currencies\").then(function (c) {\n    console.log(c);\n    var results = c.results;\n    var options_usd = '<option value=\"\">Select Currency</option>';\n    var options_ngn = '<option value=\"\">Select Currency</option>';\n    for (var i in results) {\n        var currency = results[i];\n        var def = currency.id == 'USD' ? 'selected' : '';\n        options_usd += '<option value=\"' + currency.id + '\" ' + def + '> ' + currency.currencyName + ' (' + currency.id + ') </option>';\n    }\n\n    for (var _i in results) {\n        var _currency = results[_i];\n        var _def = _currency.id == 'NGN' ? 'selected' : '';\n        options_ngn += '<option value=\"' + _currency.id + '\" ' + _def + '> ' + _currency.currencyName + ' (' + _currency.id + ') </option>';\n    }\n    var list = document.getElementsByClassName('currency_list');\n    for (var _i2 = 0; _i2 < list.length; _i2++) {\n        var element = list.item(_i2);\n        if (_i2 == 0) element.innerHTML = options_usd;else element.innerHTML = options_ngn;\n    };\n\n    //$('.currency_list').html(options);\n}).catch(function (e) {\n    console.log(e);\n});\n\ndocument.getElementById('convert').addEventListener(\"click\", convertCurrency);\n\nvar sWorker = void 0;\n\nif (navigator.serviceWorker) {\n    navigator.serviceWorker.register('/sw.js').then(function (registered) {\n        sWorker = registered;\n        console.log(registered);\n    }).catch(function (e) {\n        console.error(e);\n    });\n}\n\nfunction convertCurrency() {\n    var _from = document.getElementById('from_currency').value;\n    var _to = document.getElementById('to_currency').value;\n    var amount = parseInt(document.getElementById('amount_from_currency').value);\n\n    var spec = _from.concat('_', _to);\n\n    var query = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + spec + '&compact=y';\n\n    (0, _getAPI2.default)(query).then(function (c) {\n        var exchange = c[spec].val;\n        var result = exchange * amount;\n        var result_str = _from + ' ' + amount.format(2) + ' = ' + _to + ' ' + result.format(2);\n        document.getElementById('conversion_result').innerHTML = result_str;\n    });\n}\n\nNumber.prototype.format = function (n, x) {\n    var re = '\\\\d(?=(\\\\d{' + (x || 3) + '})+' + (n > 0 ? '\\\\.' : '$') + ')';\n    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');\n};\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/utilities/getAPI.js":
/*!*********************************!*\
  !*** ./src/utilities/getAPI.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nexports.default = function (url) {\n    return fetch(url).then(function (response) {\n        return response.json();\n    }); // parses response to JSON \n};\n\n//# sourceURL=webpack:///./src/utilities/getAPI.js?");

/***/ })

/******/ });