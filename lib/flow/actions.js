var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createActions = function () {
    Homey.manager('flow').on('action.set_string_variable', function (callback, args) {

        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, args.value, 'string');
                callback(null, true);
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
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('action.set_bool_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, args.value, 'boolean');
                callback(null, true);
            }
        }
        callback(null, false);
    });
    Homey.manager('flow').on('action.flip_bool_variable', function (callback, args) {
        if (args.variable && args.variable.name) {
            var variable = variableManager.getVariable(args.variable.name);
            if (variable) {
                variableManager.updateVariable(args.variable.name, !variable.value, 'boolean');
                callback(null, true);
            }
        }
        callback(null, false);
    });

}