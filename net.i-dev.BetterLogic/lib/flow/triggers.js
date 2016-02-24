var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createTriggers = function () {
    Homey.manager('flow').on('trigger.if_variable_changed', function (callback, args, state) {
        
        var variable = variableManager.getVariables()[0]; //dirty hack. Last updated value is always on top..
        if (args.variable.name == variable.name) {
            callback(null, true); // true to make the flow continue, or false to abort
            return;
        }
        callback(null, false); // true to make the flow continue, or false to abort
    });

    Homey.manager('flow').on('trigger.debug_any_variable_changed', function (callback, args, state) {
        // if( args.arg_id == 'something' )
        callback(null, false); // true to make the flow continue, or false to abort
    });
}