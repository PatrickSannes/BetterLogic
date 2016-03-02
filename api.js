"use strict";

var variableManager = require('./lib/variablemanagement/variablemanagement.js');

var util = require('./lib/util/util.js');

module.exports = [
    {
        description: "HTTP get variable",
        method: "GET",
        path: "/:variable",
        requires_authorization: false,
        fn: function (callback, args) {
            
            if (args && args.params && args.params.variable) {
                var variable = variableManager.getVariable(args.params.variable);
                if(variable){
                    callback(null, { name: variable.name, type : variable.type, value: variable.value });
                    return;
                }
                callback(null, "Variable not found");
                return;
            }
            callback(null, "Incorrect call");
        }
    },
    {
        description: "HTTP post value",
        method: "put",
        path: "/:variable/:value",
        requires_authorization: false,
        fn: function (callback, args) {


            if (args && args.params && args.params.variable && args.params.value) {
                var variable = variableManager.getVariable(args.params.variable);
                if (variable) {
                    if (variable.type === "boolean") {
                        Homey.log(args.params.value);
                        if (args.params.value === "true" || args.params.value === "false") {
                            variableManager.updateVariable(variable.name, (args.params.value === 'true'), variable.type);
                            callback(null, "OK");
                            return;
                        }
                        callback(null, "Incorrect value for boolean: " + args.params.value);
                        return;
                    }
                    if (variable.type === "number") {
                        if (isNumber(args.params.value))
                        {
                            variableManager.updateVariable(variable.name, parseFloat(args.params.value), variable.type);
                            callback(null, "OK");
                            return;
                        }
                        callback(null, "Incorrect value for number: " + args.params.value);
                        return;

                    }
                    if (variable.type === "string") {
                        if (typeof args.params.value ===  "string")
                        {
                            variableManager.updateVariable(variable.name, args.params.value, variable.type);
                            callback(null, "OK");
                            return;
                        }
                        callback(null, "Incorrect value for string: " + args.params.value);
                        return;

                    }
                    callback(null, "OK");
                }
                callback(null, "Variable not found");
                return;

            }
            callback(null, "Incorect call");
            
        }
    }
]

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function iskBoolean(bool) {
    return typeof bool === 'boolean' || 
          (typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
}
