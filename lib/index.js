"use strict";

require("babel-polyfill");

var _utility = require("./utility.js");

_utility.countries.then(function (c) {
    console.log(c);
});