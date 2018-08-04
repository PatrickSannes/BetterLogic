"use strict";

const Homey = require('homey');

module.exports = {
    FilterTokens: function (tokens, query, type) {
        let filterResults = [];

        if (tokens === null) {
            return filterResults;
        }

        for (let i in tokens) {
            if ((tokens[i].name.toLowerCase().indexOf(query) !== -1) &&
                (tokens[i].type === type || type === undefined)) {
                filterResults.push({ "id": tokens[i].name, "name": tokens[i].name });
            }
        }

        return filterResults;
    },
    FindVariable: function (variables, variable) {
        return variables.filter(function (item) {
            return item.name === variable;
        })[0];
    }
}