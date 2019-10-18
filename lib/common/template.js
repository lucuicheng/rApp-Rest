const fs = require('fs');
const path = require('path');
const file = require('./file');

const template = (strings, ...keys) => {
    return (function (...values) {
        let dict = values[values.length - 1] || {};
        let result = [strings[0]];
        keys.forEach(function (key, i) {
            let value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
};

module.exports = {
    url: template`${0}${'part'}`
};
