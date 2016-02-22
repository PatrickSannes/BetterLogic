"use strict";

var util = require('./lib/util/util.js');
var autoCompeteActions = require('./lib/autocomplete/actions.js');
var autoCompeteConditions = require('./lib/autocomplete/conditions.js');
var autoCompetetriggers = require('./lib/autocomplete/triggers.js');
var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var self = module.exports = {
    init: function () {
        Homey.log("pre init!!!!!!");
        
        variableManager.init();
        Homey.log("post init!!!!!!");
        autoCompeteActions.createActionAutocompleteActions();
        autoCompeteConditions.createActionAutocompleteConditions();
        autoCompetetriggers.createActionAutocompleteTriggers();

        Homey.manager('flow').on('trigger.debug_any_variable_changed', function(callback, args) {
            Homey.log("trigger!!!!!!");
            // if( args.arg_id == 'something' )
            callback(null, true); // true to make the flow continue, or false to abort
        });

        Homey.manager('flow').on('trigger.if_variable_changed', function(callback, args) {
            Homey.log("trigger!!!!!!");
            // if( args.arg_id == 'something' )
            callback(null, true); // true to make the flow continue, or false to abort
        });

        Homey.manager('flow').on('action.set_string_variable', function(callback, args) {
            Homey.log(args);
            UpdateVariable(args.variable, args.value, 'string');
            callback(null, true);
        });


        function UpdateVariable(variable, value, type) {
            Homey.log("create var " + variable);
            Homey.log(variables);
            var foundVar = variables.filter(findVariable(variable, type))[0];
            Homey.log("search old variable");
            if (foundVar) {
                Homey.log("found variable");

                if (foundVar.value === value) {
                    Homey.log("Nothing changed");
                    return;
                }
                Homey.log("remove variable");
                variables.splice(variables.indexOf(foundVar), 1);
            }

            var createdVar = {
                name: variable,
                value: value,
                description: type
            }
            Homey.log("variable created");
            variables.push(createdVar);
            Homey.log("variable pushed");
            newVar = createdVar;

            Homey.manager('flow').trigger('if_variable_changed', { variable: createdVar.variable, value: createdVar.value });
            Homey.manager('flow').trigger('debug_any_variable_changed', { variable: createdVar.name, value: createdVar.value });
            Homey.log("variable triggered");
        }
    }
};