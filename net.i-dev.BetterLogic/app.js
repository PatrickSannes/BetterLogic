"use strict";

var variableManager = require('./lib/variablemanagement/variablemanagement.js');

var util = require('./lib/util/util.js');

var autoCompeteActions = require('./lib/autocomplete/actions.js');
var autoCompeteConditions = require('./lib/autocomplete/conditions.js');
var autoCompetetriggers = require('./lib/autocomplete/triggers.js');

var flowActions = require('./lib/flow/actions.js');
var flowTriggers = require('./lib/flow/triggers.js');

var self = module.exports = {
    init: function () {
        
        variableManager.init();
        autoCompeteActions.createActionAutocompleteActions();
        autoCompeteConditions.createActionAutocompleteConditions();
        autoCompetetriggers.createActionAutocompleteTriggers();

        flowActions.createActions();
        flowTriggers.createTriggers();
     
    }
};