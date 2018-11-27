"use strict";

const Homey = require('homey');

var math = require('../util/math.js');
var util = require('../util/util.js');

module.exports = {
    CreateFlowCardTriggers: function (variableManager) {
        if (variableManager === undefined) {
            return;
        }

        this.variableManager = variableManager;

        // if_variable_changed
        let if_variable_changed = new Homey.FlowCardTrigger('if_variable_changed');
        if_variable_changed.register()
            .on('run', (args, state, callback) => {
                if (args.variable && state.name && args.variable.name == state.name) {
                    callback(null, true); // true to make the flow continue, or false to abort
                    return;
                }
                callback(null, false); // true to make the flow continue, or false to abort
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
            });

        // if_variable_set
        let if_variable_set = new Homey.FlowCardTrigger('if_variable_set');
        if_variable_set.register()
            .on('run', (args, state, callback) => {
                if (args.variable && state.name && args.variable.name == state.name) {
                    callback(null, true); // true to make the flow continue, or false to abort
                    return;
                }
                callback(null, false); // true to make the flow continue, or false to abort
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.contains(query)));
            });

        // if_one_of_variable_changed
        let if_one_of_variable_changed = new Homey.FlowCardTrigger('if_one_of_variable_changed');
        if_one_of_variable_changed.register()
            .on('run', (args, state, callback) => {
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

        // if_number_variable_changed
        let if_number_variable_changed = new Homey.FlowCardTrigger('if_number_variable_changed');
        if_number_variable_changed.register()
            .on('run', (args, state, callback) => {
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
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(variableManager.getVariables().filter(util.filterVariable(query, 'number')));
            });

        // debug_any_variable_changed
        let debug_any_variable_changed = new Homey.FlowCardTrigger('debug_any_variable_changed');
        debug_any_variable_changed.register()
            .on('run', (args, state, callback) => {
                callback(null, false); // true to make the flow continue, or false to abort
            });
    }
}
