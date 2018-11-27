"use strict";

const Homey = require('homey');

var math = require('../util/math.js');
var util = require('../util/util.js');

module.exports = {
    CreateFlowCardActions: function (variableManager) {
        if (variableManager === undefined) {
            return;
        }

        this.variableManager = variableManager;

        // set string
        let set_string_variable = new Homey.FlowCardAction('set_string_variable');
        set_string_variable.register();
        set_string_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                  return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'string'));
                }
                return Promise.reject(new Error('String variable not found (' + args.variable.name + ')'));
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'string')));
            });

        // set number
        let set_number_variable = new Homey.FlowCardAction('set_number_variable');
        set_number_variable.register();
        set_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                  return Promise.resolve(variableManager.updateVariable(args.variable.name, args.value, 'number'));
                }
                return Promise.reject(new Error('Number variable not found (' + args.variable.name + ')'));
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'number')));
            });

        // increment number
        let increment_number_variable = new Homey.FlowCardAction('increment_number_variable');
        increment_number_variable.register();
        increment_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                  return Promise.resolve(variableManager.updateVariable(args.variable.name, result.value + args.value, 'number'));
                }
                return Promise.reject(new Error('Number variable not found (' + args.variable.name + ')'));
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
              return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'number')));
            });

        // decrement number
        let decrement_number_variable = new Homey.FlowCardAction('decrement_number_variable');
        decrement_number_variable.register();
        decrement_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                  return Promise.resolve(variableManager.updateVariable(args.variable.name, result.value - args.value, 'number'));
                }
                return Promise.reject(new Error('Number variable not found (' + args.variable.name + ')'));
            }
          })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'number')));
            });

        // execute expressoin
        let execute_expression = new Homey.FlowCardAction('execute_expression');
        execute_expression.register();
        execute_expression.registerRunListener((args, state) => {
            if (args.expression && args.variable && args.variable.name) {
                try {
                    var result = variableManager.getVariable(args.variable.name);
                    var expression = util.buildExpression(args.expression);

                    if (result) {
                        var newValue = math.eval(expression);

                        return Promise.resolve(variableManager.updateVariable(args.variable.name, newValue, 'number'));
                    }
                    return Promise.reject(new Error('Variable not found (' + args.variable.name + ')'));
                } catch (err) {
                    return Promise.reject(new Error('Error executing expression: ' + err.message));
                }
            }
          })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'number')));
            });

        // set boolean
        let set_boolean_variable = new Homey.FlowCardAction('set_boolean_variable');
        set_boolean_variable.register();
        set_boolean_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                    return Promise.resolve(variableManager.updateVariable(args.variable.name, (args.boolean_value.toLowerCase()==='true'), 'boolean'));
                }
                return Promise.reject(new Error('Boolean variable not found (' + args.variable.name + ')'));
            }
          })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'boolean')));
            });

        // flip Boolean
        let flip_boolean_variable = new Homey.FlowCardAction('flip_boolean_variable');
        flip_boolean_variable.register();
        flip_boolean_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                    return Promise.resolve(variableManager.updateVariable(args.variable.name, !result.value, 'boolean'));
                }
                return Promise.reject(new Error('Boolean variable not found (' + args.variable.name + ')'));
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'boolean')));
            });

        // trigger variable
        let trigger_variable = new Homey.FlowCardAction('trigger_variable');
        trigger_variable.register();
        trigger_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);

                if (result) {
                    return Promise.resolve(variableManager.updateVariable(args.variable.name, new Date().toISOString(), 'trigger'));
                }
                return Promise.reject(new Error('Trigger variable not found (' + args.variable.name + ')'));
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'trigger')));
            });

        // set variable
        let set_a_variable = new Homey.FlowCardAction('set_a_variable');
        set_a_variable.register();
        set_a_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = variableManager.getVariable(args.variable.name);
                if (result) {
                    if (result.type === "boolean") {
                        if (args.value === "true" || args.value === "false") {
                            return Promise.resolve(variableManager.updateVariable(result.name, (args.value === 'true'), result.type));
                        }
                        return Promise.reject(new Error('No boolean value'));
                    }
                    else if (result.type === "number") {
                        if (!isNaN(parseFloat(args.value))) {
                            return Promise.resolve(variableManager.updateVariable(result.name, parseFloat(args.value), result.type));
                        }
                        return Promise.reject(new Error('Not a number'));
                    }
                    else if (result.type === "string") {
                        if (typeof args.value === "string") {
                          return Promise.resolve(variableManager.updateVariable(result.name, args.value, result.type));
                        }
                        return Promise.reject(new Error('No string value'));
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(new Error('Variable not found (' + args.variable.name + ')'));
            }
            return Promise.resolve(true);
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
            });
    }
}
