var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
var math = require('../util/math.js');

exports.createConditions = function (variables) {
    //Conditions autocomples
    Homey.manager('flow').on('condition.variable_contains', function (callback, args) {
        if(args.variable){
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value.toLowerCase().indexOf(args.value.toLowerCase()) > -1) {
                Homey.log('variable_contains');
                callback(null, true);
            return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_starts_with', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value.toLowerCase().indexOf(args.value.toLowerCase())===0) {
                Homey.log('variable_starts_with');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_matches_string', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value.toLowerCase() === args.value.toLowerCase()) {
                Homey.log('variable_matches_string');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('condition.variable_matches_number', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable && variable.value === args.value) {
                Homey.log('variable_matches_number');
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
                Homey.log('variable_greater_than');
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
                Homey.log('variable_less_than');
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
                Homey.log('variable_is_equal');
                callback(null, variable.value);
                return;
            }
        }
        callback(null, false);
    });

    Homey.manager('flow').on('condition.expression', function (callback, args) {
        if (args.expression) {
            try {
                var expression = util.buildExpression(args.expression);
                Homey.log(expression);
                Homey.log("Result: " + math.eval(expression));
                callback(null, math.eval(expression));
                return;
            } catch (err) {
                callback(null, false);
                return;
            }
        }
    });
}