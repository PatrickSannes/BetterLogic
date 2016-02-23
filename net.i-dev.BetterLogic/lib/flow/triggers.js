var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createTriggers = function () {
    Homey.manager('flow').on('trigger.if_variable_changed', function (callback, args) {
        Homey.log("trigger!!!!!!");
        Homey.log(args);
        callback(null, true); // true to make the flow continue, or false to abort
    });

    Homey.manager('flow').on('trigger.debug_any_variable_changed', function (callback, args) {
        Homey.log("trigger!!!!!!");
        // if( args.arg_id == 'something' )
        callback(null, true); // true to make the flow continue, or false to abort
    });
}