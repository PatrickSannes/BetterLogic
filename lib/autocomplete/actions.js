var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteActions = function () {
    Homey.manager('flow').on('action.set_string_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'string')));
    });
    Homey.manager('flow').on('action.set_number_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('action.increment_number_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('action.decrement_number_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('action.set_boolean_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'boolean')));
    });
    Homey.manager('flow').on('action.flip_boolean_variable.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'boolean')));
    });
}