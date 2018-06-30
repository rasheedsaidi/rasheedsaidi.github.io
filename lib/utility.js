'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function countries() {
    return fetch('https://free.currencyconverterapi.com/api/v5/currencies');
}

exports.countries = countries;