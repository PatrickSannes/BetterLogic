var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createTriggers = function () {
    Homey.manager('flow').on('trigger.if_variable_changed', function (callback, args, state) {
        if (args.variable && state.name && args.variable.name == state.name) {
            callback(null, true); // true to make the flow continue, or false to abort
            return;
        }
        callback(null, false); // true to make the flow continue, or false to abort
    });
    
    Homey.manager('flow').on('trigger.if_variable_set', function (callback, args, state) {
        if (args.variable && state.name && args.variable.name == state.name) {
            callback(null, true); // true to make the flow continue, or false to abort
            return;
        }
        callback(null, false); // true to make the flow continue, or false to abort
    });
    
    Homey.manager('flow').on('trigger.if_one_of_variable_changed', function (callback, args, state) {
        if (args.variable && state.name) {
            try {
                var selectedVariables = args.variable.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/);
                callback(null, (selectedVariables.indexOf(state.name) >= 0)); // true to make the flow continue, or false to abort
                return;
            } catch (err) {
                callback(null, false);
                return;
            }
        }
        callback(null, false); // true to make the flow continue, or false to abort
    });

    Homey.manager('flow').on('trigger.if_number_variable_changed', function (callback, args, state) {
        if (args.variable && state && state.oldVariable && state.newVariable) {
            if (args.variable.name === state.newVariable.name) {
                if (args.action === 'changed') {
                    if (Math.abs(state.oldVariable.value - state.newVariable.value) >= args.amount) {
                        callback(null, true);
                        return;
                    }
                }

                if (args.action === 'increased') {

                    if ((state.newVariable.value - state.oldVariable.value) >= args.amount) {
                        callback(null, true);
                        return;
                    }
                }
                if (args.action === 'decreased') {
                    if ((state.oldVariable.value - state.newVariable.value) >= args.amount) {
                        callback(null, true);
                        return;
                    }
                }
            }
        }
        callback(null, false); // true to make the flow continue, or false to abort
    });
   
    Homey.manager('flow').on('trigger.debug_any_variable_changed', function (callback, args, state) {
        callback(null, false); // true to make the flow continue, or false to abort
    });
}