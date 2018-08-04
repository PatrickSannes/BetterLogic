"use strict";

const Homey = require('homey');
var Utilities = require('./Utilities.js');

var math = require('../util/math.js');
var util = require('../util/util.js');

module.exports = {
    CreateFlowCardActions: function (tokens) {
        if (tokens === undefined) {
            return;
        }

        this.tokens = tokens;

        // set string
        let set_string_variable = new Homey.FlowCardAction('set_string_variable');
        set_string_variable.register();
        set_string_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(args.value,
                        function (err) {
                            if (err) return console.error('set_string_variable error:', err);
                        }));
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'string'));
            });

        // set number
        let set_number_variable = new Homey.FlowCardAction('set_number_variable');
        set_number_variable.register();
        set_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(args.value,
                        function (err) {
                            if (err) return console.error('set_number_variable error:', err);
                        }));
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // increment number
        let increment_number_variable = new Homey.FlowCardAction('increment_number_variable');
        increment_number_variable.register();
        increment_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(result.token.value + args.value,
                        function (err) {
                            if (err) return console.error('increment_number_variable error:', err);
                        }));
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // decrement number
        let decrement_number_variable = new Homey.FlowCardAction('decrement_number_variable');
        decrement_number_variable.register();
        decrement_number_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(result.token.value - args.value,
                        function (err) {
                            if (err) return console.error('decrement_number_variable error:', err);
                        }));
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'number'));
            });

        // execute expressoin
        let execute_expression = new Homey.FlowCardAction('execute_expression');
        execute_expression.register();
        execute_expression.registerRunListener((args, state) => {
            if (args.expression && args.variable && args.variable.name) {
                try {
                    var result = Utilities.FindVariable(tokens, args.variable.name);
                    var expression = util.buildExpression(args.expression);
                    if (result) {
                        var newValue = math.eval(expression);

                        return Promise.resolve(result.token.setValue(newValue,
                            function (err) {
                                if (err) return console.error('execute_expression error:', err);
                            }));
                    }
                } catch (err) {
                    // TODO error handling
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query));
            });

        // set boolean
        let set_boolean_variable = new Homey.FlowCardAction('set_boolean_variable');
        set_boolean_variable.register();
        set_boolean_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue((args.boolean_value.toLowerCase() === 'true'),
                        function (err) {
                            if (err) return console.error('set_boolean_variable error:', err);
                        }));
                };
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'boolean'));
            });

        // flip Boolean
        let flip_boolean_variable = new Homey.FlowCardAction('flip_boolean_variable');
        flip_boolean_variable.register();
        flip_boolean_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(!result.token,
                        function (err) {
                            if (err) return console.error('flip_boolean_variable error:', err);
                        }));
                };
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'boolean'));
            });

        // trigger variable
        let trigger_variable = new Homey.FlowCardAction('trigger_variable');
        trigger_variable.register();
        trigger_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);

                if (result) {
                    return Promise.resolve(result.token.setValue(new Date().toISOString(),
                        function (err) {
                            if (err) return console.error('flip_boolean_variable error:', err);
                        }));
                };
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'trigger'));
            });

        // set variable
        let set_a_variable = new Homey.FlowCardAction('set_a_variable');
        set_a_variable.register();
        set_a_variable.registerRunListener((args, state) => {
            if (args.variable && args.variable.name) {
                var result = Utilities.FindVariable(tokens, args.variable.name);
                if (result) {
                    if (result.type === "boolean") {
                        if (args.value === "true" || args.value === "false") {
                            return Promise.resolve(result.token.setValue((args.value.toLowerCase() === 'true'),
                                function (err) {
                                    if (err) return console.error('trigger_variable (boolean) error:', err);
                                }));
                        }
                    }
                    else if (result.type === "number") {
                        if (!isNaN(parseFloat(args.value))) {
                            return Promise.resolve(result.token.setValue(parseFloat(args.value),
                                function (err) {
                                    if (err) return console.error('trigger_variable (number) error:', err);
                                }));
                        }
                    }
                    else if (result.type === "string") {
                        if (typeof args.value === "string") {
                            return Promise.resolve(result.token.setValue(args.value,
                                function (err) {
                                    if (err) return console.error('trigger_variable (string) error:', err);
                                }));
                        }
                    }
                }
            }
        })
            .getArgument('variable')
            .registerAutocompleteListener((query, args) => {
                return Promise.resolve(Utilities.FilterTokens(tokens, query, 'trigger'));
            });
    }
}