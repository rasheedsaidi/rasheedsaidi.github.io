import getAPI from './utilities/getAPI';

let countries = {};
getAPI("https://free.currencyconverterapi.com/api/v5/currencies").then( c => { console.log(c);
    const results = c.results;
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
    };

    //$('.currency_list').html(options);
}).catch( e => {
    console.log(e);
});

document.getElementById('convert').addEventListener("click", convertCurrency);

let sWorker;

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js').then( registered => {
        sWorker = registered;
        console.log(registered);
    }).catch( e => {
        console.error(e);
    });
}

function convertCurrency() {
    const _from = document.getElementById('from_currency').value;
    const _to = document.getElementById('to_currency').value;
    const amount = parseInt(document.getElementById('amount_from_currency').value);

    const spec = _from.concat('_', _to);

    const query = `https://free.currencyconverterapi.com/api/v5/convert?q=${spec}&compact=y`;

    getAPI(query).then( c => {
        let exchange = c[spec].val;
        const result = exchange * amount;
        const result_str = `${_from} ${amount.format(2)} = ${_to} ${result.format(2)}`;
        document.getElementById('conversion_result').innerHTML = result_str;
    }
        
    );
}

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};
