"use strict";

var variableManager = require('./lib/variablemanagement/variablemanagement.js');

var util = require('./lib/util/util.js');

module.exports = [
    {
        description: "HTTP get variable",
        method: "GET",
        path: "/:variable",
        requires_authorization: true,
        fn: function (callback, args) {
           
            if (args && args.params && args.params.variable) {
                if (args.params.variable.toLowerCase() === 'all') {
                    callback(null,variableManager.getVariables());
                    return;
                }
                var variable = variableManager.getVariable(args.params.variable);
                if(variable){
                    callback(null, { name: variable.name, type : variable.type, value: variable.value });
                    return;
                }
                return;
            }
            callback("Incorrect call");
        }
    }, {
        description: "HTTP post value",
        method: "put",
        path: "/:variable/:action/:value",
        requires_authorization: true,
        fn: function(callback, args) {
            if (args && args.params && args.params.variable && args.params.value && args.params.action) {
                if (args.params.action !== 'i' && args.params.action !== 'd' && args.params.action !== 'I' && args.params.action !== 'D') {
                    callback("Invalid action. Specify i for Increment and d for Decrement.");
                    return;
                }

                var variable = variableManager.getVariable(args.params.variable);
                if (!variable) {
                    callback("Variable not found");
                    return;
                }
                if (variable.type !== "number") {
                    callback("Can only increment or decrement numbers");
                    return;
                }
                if (args.params.action === "i" || args.params.action === "I") {
                    variableManager.updateVariable(variable.name, variable.value + parseFloat(args.params.value), variable.type);
                    callback(null, "OK");
                    return;
                }
                if (args.params.action === "d" || args.params.action === "D") {
                    variableManager.updateVariable(variable.name, variable.value - parseFloat(args.params.value), variable.type);
                    callback(null, "OK");
                    return;
                }
                callback("Incorect call");
        }
        }
    },{
        description: "HTTP post value",
        method: "put",
        path: "/:variable/:value",
        requires_authorization: true,
        fn: function(callback, args) {
            if (args && args.params && args.params.variable && args.params.value) {
                var variable = variableManager.getVariable(args.params.variable);
                if (variable) {
                    if (variable.type === "boolean") {
                        Homey.log(args.params.value);
                        if (args.params.value === "true" || args.params.value === "false" || args.params.value === "toggle") {

                            if (args.params.value === "toggle") {
                                var oldVariable = variableManager.getVariable(variable.name);
                                variableManager.updateVariable(variable.name, (!oldVariable.value), variable.type);
                            } else {
                                variableManager.updateVariable(variable.name, (args.params.value === 'true'), variable.type);
                            }
                            callback(null, "OK");
                            return;
                        }
                        callback("Incorrect value for boolean: " + args.params.value);
                        return;
                    }
                    if (variable.type === "number") {
                        if (isNumber(args.params.value)) {
                            variableManager.updateVariable(variable.name, parseFloat(args.params.value), variable.type);
                            callback(null, "OK");
                            return;
                        }
                        callback("Incorrect value for number: " + args.params.value);
                        return;

                    }
                    if (variable.type === "string") {
                        if (typeof args.params.value === "string") {
                            variableManager.updateVariable(variable.name, args.params.value, variable.type);
                            callback(null, "OK");
                            return;
                        }
                        callback("Incorrect value for string: " + args.params.value);
                        return;

                    }
                    callback(null, "OK");
                }
                callback("Variable not found");
                return;

            }
            callback("Incorect call");

        }
    }
]

function isNumber(obj) { return !isNaN(parseFloat(obj)) }