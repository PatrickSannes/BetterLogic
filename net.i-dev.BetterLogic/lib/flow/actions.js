var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createActions = function () {
    Homey.manager('flow').on('action.set_string_variable', function (callback, args) {

        if (args.variable.name) {
            variableManager.updateVariable(args.variable.name, args.value, 'string');
            callback(null, true);
        }
        callback(null, false);
    });

}