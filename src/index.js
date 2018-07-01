import getAPI from './utilities/getAPI';
import idb from 'idb';

var dbPromise = idb.open('currency-db', 1, function(upgradeDb) {  
    upgradeDb.createObjectStore('currencies');
    upgradeDb.createObjectStore('rates', { keyPath: 'id' }); 
});

let countries = {};
dbPromise.then( db => { 
    var tx = db.transaction('currencies');
    var keyValStore = tx.objectStore('currencies');
    return keyValStore.get('currencies');
}).then( response => {
    
    if(!response) {
        throw (response);
    }
    const results = response.results;  
    processResult(results);
  
}).catch( e => {
    getAPI("https://free.currencyconverterapi.com/api/v5/currencies").then( response => {
        dbPromise.then( db => {
            var tx = db.transaction('currencies', 'readwrite');
            var keyValStore = tx.objectStore('currencies');
            keyValStore.put(response, "currencies");
            tx.complete;
            
            const results = response.results;
            processResult(results);
        });

    });
});


document.getElementById('convert').addEventListener("click", convertCurrency);

let sWorker;

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js').then( registered => {
        sWorker = registered;
    }).catch( e => {
        console.error(e);
    });
}

function processResult(results) {
    let options_usd = '<option value="">Select Currency</option>';
    let options_ngn = '<option value="">Select Currency</option>';
    for( let i in results ) {
        let currency = results[i];
        let def = (currency.id == 'USD')? 'selected': '';
        options_usd += `<option value="${currency.id}" ${def}> ${currency.currencyName} (${currency.id}) </option>`;
    }

    for( let i in results ) {
        let currency = results[i];
        let def = (currency.id == 'NGN')? 'selected': '';
        options_ngn += `<option value="${currency.id}" ${def}> ${currency.currencyName} (${currency.id}) </option>`;
    }
    const list = document.getElementsByClassName('currency_list');
    for( let i = 0; i < list.length; i++) {
        let element = list.item(i);
        if(i == 0)
            element.innerHTML = options_usd;
        else
            element.innerHTML = options_ngn;
    }
}

function convertCurrency() {
    const _from = document.getElementById('from_currency').value;
    const _to = document.getElementById('to_currency').value;
    const amount = parseInt(document.getElementById('amount_from_currency').value);

    const spec = _from.concat('_', _to);

    dbPromise.then(function(db) {
        var tx = db.transaction('rates');
        var ratesStore = tx.objectStore('rates');
      
        return ratesStore.get(spec);
    }).then(function(rate) {
        if(!rate) throw (rate);

        let exchange = rate.rate;
        const result = exchange * amount;
        const result_str = `${_from} ${amount.format(4)} = ${_to} ${result.format(2)}`;
        document.getElementById('conversion_result').innerHTML = result_str;
    }).catch( e => {

        const query = `https://free.currencyconverterapi.com/api/v5/convert?q=${spec}&compact=y`;

        getAPI(query).then( c => { 
            
            let exchange = c[spec].val;
            saveRate(_from, _to, exchange);            
            const result = exchange * amount;
            const result_str = `${_from} ${amount.format(2)} = ${_to} ${result.format(4)}`;
            document.getElementById('conversion_result').innerHTML = result_str;
        }
            
        );
    });
}

function saveRate(from, to, rate) {
    const spec_from = from.concat('_', to);
    const spec_to = to.concat('_', from);
    const to_rate = 1/rate;

    let rate_from = {
        id: spec_from,
        rate: rate,
        timestamp: Date.now()
    };

    let rate_to = {
        id: spec_to,
        rate: to_rate.format(6),
        timestamp: Date.now()
    };

    dbPromise.then(function(db) {
        var tx = db.transaction('rates', 'readwrite');
        var ratesStore = tx.objectStore('rates');
      
        ratesStore.put(rate_from);
        ratesStore.put(rate_to);

        return tx.complete;
    }).then( c => {
        console.log('Currency saved');
    });


}

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};
