var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteConditions = function (variables) {
    //Conditions autocomples
    Homey.manager('flow').on('condition.variable_contains.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'string')));
    });
    Homey.manager('flow').on('condition.variable_starts_with.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'string')));
    });
    Homey.manager('flow').on('condition.variable_matches_string.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'string')));
    });
    Homey.manager('flow').on('condition.variable_matches_number.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('condition.variable_greater_than.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('condition.variable_less_than.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('condition.variable_is_equal.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'boolean')));
    });
}