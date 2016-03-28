var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
var math = require('../util/math.js');

exports.createActions = function () {
    Homey.manager('flow').on('action.set_string_variable', function (callback, args) {

        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, args.value, 'string');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });

    Homey.manager('flow').on('action.set_number_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, args.value, 'number');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('action.increment_number_variable', function (callback, args) {
        Homey.log(args);
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if(variable){
            Homey.log(variable);
            variableManager.updateVariable(args.variable.name, variable.value + args.value, 'number');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('action.decrement_number_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, variable.value - args.value, 'number');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    
    Homey.manager('flow').on('action.execute_expression', function (callback, args) {
        Homey.log('execute_expression');
        if (args.expression && args.variable && args.variable.name) {
            try {
                var variable = variableManager.getVariable(args.variable.name);
                var expression = util.buildExpression(args.expression);
                if (variable) {
                    var newValue = math.eval(expression);
                    Homey.log('Expression result: ' + newValue);
                    variableManager.updateVariable(args.variable.name, newValue, 'number');
                    callback(null, true);
                    return;
                }
            } catch (err) {
                Homey.log(err);
                callback(null, false);
                return;
            }
        }
        callback(null, false);
    });

    Homey.manager('flow').on('action.set_boolean_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, (args.boolean_value.toLowerCase()==='true'), 'boolean');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('action.flip_boolean_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, !variable.value, 'boolean');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });

    Homey.manager('flow').on('action.set_a_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                if (variable.type === "boolean") {
                    if (args.value === "true" || args.value === "false") {
                        variableManager.updateVariable(variable.name, (args.value === 'true'), variable.type);
                        callback(null, true);
                        return;
                    }
                    callback(null, false);
                    return;
                }
                if (variable.type === "number") {
                    if (isNumber(args.value)) {
                        variableManager.updateVariable(variable.name, parseFloat(args.value), variable.type);
                        callback(null, true);
                        return;
                    }
                    callback(null, false);
                    return;

                }
                if (variable.type === "string") {
                    if (typeof args.value === "string") {
                        variableManager.updateVariable(variable.name, args.value, variable.type);
                        callback(null, true);
                        return;
                    }
                    callback(null, false);
                    return;

                }
                callback(null, true);
            }
            callback(null, false);
            return;
        }
        callback(null, true);
    });
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function iskBoolean(bool) {
    return typeof bool === 'boolean' || 
          (typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
}