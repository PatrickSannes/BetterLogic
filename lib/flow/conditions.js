var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createConditions = function (variables) {
    //Conditions autocomples
    Homey.manager('flow').on('condition.variable_contains', function (callback, args) {
        if(args.variable){
        var variable = variableManager.getVariable(args.variable.name);
        if (variable && variable.value.toLowerCase().indexOf(args.value.toLowerCase()) > 1) {
            callback(null, true);
            return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_matches_string', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value.toLowerCase() == args.value.toLowerCase()) {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_matches_number', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value == args.value) {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_greater_than', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value > args.value) {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_less_than', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value < args.value) {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_is_equal', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                callback(null, variable.value);
                return;
            }
        }
        callback(null, false);
    });
}