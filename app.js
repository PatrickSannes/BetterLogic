"use strict";

var variableManager = require('./lib/variablemanagement/variablemanagement.js');

var util = require('./lib/util/util.js');

var autoCompeteActions = require('./lib/autocomplete/actions.js');
var autoCompeteConditions = require('./lib/autocomplete/conditions.js');
var autoCompetetriggers = require('./lib/autocomplete/triggers.js');

var flowActions = require('./lib/flow/actions.js');
var flowConditions = require('./lib/flow/conditions.js');
var flowTriggers = require('./lib/flow/triggers.js');

var self = module.exports = {
    init: function () {
        
        variableManager.init();
        autoCompeteActions.createAutocompleteActions();
        autoCompeteConditions.createAutocompleteConditions();
        autoCompetetriggers.createAutocompleteTriggers();

        flowActions.createActions();
        flowConditions.createConditions();
        flowTriggers.createTriggers();
     
    }
};