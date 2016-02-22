﻿var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createActionAutocompleteTriggers = function (variables) {
    //Triggers autocomples
    Homey.manager('flow').on('trigger.if_variable_changed.variable.autocomplete', function(callback, value) {
        callback(null, variableManager.getVariables().filter(util.contains(value)));
    });
}