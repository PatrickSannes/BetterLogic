"use strict";

const Homey = require('homey');
var Utilities = require('./Utilities.js');

var math = require('../util/math.js');
var util = require('../util/util.js');

module.exports = {
    CreateFlowCardConditions: function (tokens) {
        if (tokens === undefined) {
            return;
        }

        this.tokens = tokens;

        //variable_contains
        let variable_contains = new Homey.FlowCardCondition('variable_contains');
        variable_contains.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value.toLowerCase().indexOf(args.value.toLowerCase()) > -1) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'string'));
            });

        // variable_starts_with
        let variable_starts_with = new Homey.FlowCardCondition('variable_starts_with');
        variable_starts_with.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value.toLowerCase().indexOf(args.value.toLowerCase()) === 0) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'string'));
            });

        // variable_matches_string
        let variable_matches_string = new Homey.FlowCardCondition('variable_matches_string');
        variable_matches_string.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value.toLowerCase() === args.value.toLowerCase()) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'string'));
            });

        // variable_matches_number
        let variable_matches_number = new Homey.FlowCardCondition('variable_matches_number');
        variable_matches_number.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value === args.value) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // variable_greater_than
        let variable_greater_than = new Homey.FlowCardCondition('variable_greater_than');
        variable_greater_than.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value > args.value) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // variable_less_than
        let variable_less_than = new Homey.FlowCardCondition('variable_less_than');
        variable_less_than.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable && variable.value < args.value) {
                        callback(null, true);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // variable_is_equal
        let variable_is_equal = new Homey.FlowCardCondition('variable_is_equal');
        variable_is_equal.register()
            .on('run', (args, state, callback) => {
                if (args.variable) {
                    var variable = Utilities.FindVariable(tokens, args.variable.name);
                    if (variable) {
                        callback(null, variable.value);
                        return;
                    }
                }
                callback(null, false);
            })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'boolean'));
            });

        // condition_expression
        let condition_expression = new Homey.FlowCardCondition('expression');
        condition_expression.register()
            .on('run', (args, state, callback) => {
                if (args.expression) {
                    try {
                        var expression = util.buildExpression(args.expression);
                        callback(null, math.eval(expression));
                        return;
                    } catch (err) {
                        callback(null, false);
                        return;
                    }
                }
            });
    }
}