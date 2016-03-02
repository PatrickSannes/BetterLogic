var util = require('../util/util.js');

var variables = [];
var newVar = '';
var receivedVariables = [];
var receivedVariable;
var hasReceivedVariables = false;
var hasReceivedVariable = false;
var insights = [];

module.exports = {
    init: function() {
        variables = Homey.manager("settings").get('variables');
        if (!variables) {
            variables = [];
        }

        Homey.manager('insights').getLogs(function(err, logs) {
            logs.forEach(function (log) {
                //Homey.manager('insights').deleteLog(log.name, function (err, state) { });
                insights.push(log.name);
            });
        });

        Homey.log(variables);
        Homey.manager('settings').on('set', function(action) {
            if (action == 'changedVariables') {
                receivedVariables = Homey.manager("settings").get('changedVariables');
                if (!receivedVariables) {
                    receivedVariables = [];
                }
                hasReceivedVariables = true;
            }
            if (action == 'changedVariable') {
                receivedVariable = Homey.manager("settings").get('changedVariable');
                hasReceivedVariable = true;
            }
            if (hasReceivedVariables && hasReceivedVariable) {
                Homey.log(variables);
                var oldVariable = findVariable(variables, receivedVariable.name);
                variables = receivedVariables;
                hasReceivedVariables = false;
                hasReceivedVariable = false;
                processValueChanged(variables, oldVariable, receivedVariable);
            }
        });
    },
    getVariables: function() {
        return variables;
    },
    getVariable : function(variable) {
        return findVariable(variables, variable);
    },
    updateVariable: function (variable, value, type) {
        var oldVariable = findVariable(variables, variable);
        if (oldVariable) {
            if (oldVariable.value == value) {
                return;
            }
            variables.splice(variables.indexOf(oldVariable), 1);
        } else {
            return;
        }

        var newVariable = {
            name: variable,
            value: value,
            type: type,
            hasInsights: oldVariable.hasInsights,
            remove: oldVariable.remove,
            lastChanged: getShortDate()
        }
        variables.unshift(newVariable);

        processValueChanged(variables, oldVariable, newVariable);
        Homey.manager('api').realtime('setting_changed', newVariable);
    }
}

function findVariable(variables, variable) {
    return variables.filter(function (item) {return item.name === variable;
    })[0];
}
function processValueChanged(variables,oldvariable, newVariable) {
    Homey.manager('settings').set('variables', variables);
    Homey.log('------');
    Homey.log('---OLDVAR---');
    Homey.log(oldvariable);
    Homey.log('---NEWVAR---');
    Homey.log(newVariable);
    Homey.log('------');
    if ((newVariable && newVariable.remove) || (oldvariable && newVariable && oldvariable.hasInsights && !newVariable.hasInsights)) {
        Homey.log('delete log');
        Homey.manager('insights').deleteLog(oldvariable.name, function (err, state) { });
        insights.splice(insights.indexOf(oldvariable.name),1);
        return;
    }
    
    if (newVariable && newVariable.hasInsights && !logExists(newVariable.name)) {
        Homey.log('Create log');
        Homey.manager('insights').createLog(newVariable.name, { 'en': newVariable.name }, newVariable.type, { 'en': '' }, function (err, state) { });
        insights.push(newVariable.name);
    }
    
    if (newVariable && newVariable.hasInsights && logExists(newVariable.name)) {
        Homey.log('Create entry');
        Homey.manager('insights').createEntry(newVariable.name, newVariable.value, new Date(), function(err, success) {});
    }

    if (oldvariable && newVariable && oldvariable.value != newVariable.value) {
        Homey.manager('flow').trigger('if_variable_changed', { "variable" : newVariable.name, "value": newVariable.value }, newVariable);
        Homey.manager('flow').trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    }

    if (newVariable && newVariable.type == 'boolean') {
        Homey.manager('settings').set('boolValueChanged', newVariable);
    }
}

function logExists(variableName) {
    return insights.indexOf(variableName) > -1;
}


function getShortDate() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}