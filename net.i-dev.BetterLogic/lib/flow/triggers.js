var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createTriggers = function () {
    Homey.manager('flow').on('trigger.if_variable_changed', function (callback, args, state) {
        Homey.log("in trigger gekomen");
        Homey.log(args);
        callback(null, true); // true to make the flow continue, or false to abort
    });

    Homey.manager('flow').on('trigger.debug_any_variable_changed', function (callback, args, state) {
        Homey.log("trigger!!!!!!");
        // if( args.arg_id == 'something' )
        callback(null, false); // true to make the flow continue, or false to abort
    });
}