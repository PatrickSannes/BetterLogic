var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createAutocompleteTriggers = function (variables) {
    //Triggers autocomples
    Homey.manager('flow').on('trigger.if_variable_changed.variable.autocomplete', function(callback, value) {
        callback(null, variableManager.getVariables().filter(util.contains(value)));
    });
    Homey.manager('flow').on('trigger.if_variable_set.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.contains(value)));
    });
    Homey.manager('flow').on('trigger.if_number_variable_changed.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getVariables().filter(util.filterVariable(value, 'number')));
    });
}