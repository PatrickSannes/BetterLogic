var util = require('../util/util.js');

var newVar = '';
var insights = [];

module.exports = {
    init: function() {
        //Homey.manager('insights').getLogs(function(err, logs) {
        //    logs.forEach(function (log) {
        //        //Homey.manager('insights').deleteLog(log.name, function (err, state) { });
        //        insights.push(log.name);
        //    });
        //});

        Homey.manager('settings').on('set', function(action) {
            if (action == 'changedVariables') {
                changeObject = Homey.manager("settings").get('changedVariables');
                var newVariables = changeObject.variables;
                var newVariable = changeObject.variable;
                Homey.log('-----Vars Changed----');
                Homey.log(newVariables);
                Homey.log('---------------------');
                if (!newVariables) {
                    newVariables = [];
                }
            
                Homey.log('-----Var Changed-----');
                Homey.log(newVariable);
                Homey.log('---------------------');

                var oldVariables = getVariables();
                var oldVariable = findVariable(oldVariables, newVariable.name);
                processValueChanged(newVariables, oldVariable, newVariable);
            }
        });
    },
    getVariables: function() {
        return getVariables();
    },
    getVariable : function(variable) {
        return findVariable(getVariables(), variable);
    },
    updateVariable: function (variable, value, type) {
        var variables = getVariables();
        var oldVariable = findVariable(variables, variable);
        if (oldVariable) {
            if (oldVariable.value === value) {
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
function processValueChanged(variables, oldVariable, newVariable) {
    Homey.manager('settings').set('variables', variables);
    if ((newVariable && newVariable.remove) || (oldVariable && newVariable && oldVariable.hasInsights && !newVariable.hasInsights)) {
        Homey.manager('insights').deleteLog(oldVariable.name, function (err, state) { });
        insights.splice(insights.indexOf(oldVariable.name),1);
        return;
    }
    
    if (newVariable && newVariable.hasInsights && !logExists(newVariable.name)) {
        Homey.manager('insights').createLog(newVariable.name, { 'en': newVariable.name }, newVariable.type, { 'en': '' }, function (err, state) { });
        insights.push(newVariable.name);
    }
    
    if (newVariable && newVariable.hasInsights && logExists(newVariable.name)) {
        Homey.manager('insights').createEntry(newVariable.name, newVariable.value, new Date(), function(err, success) {});
    }

    if (oldVariable && newVariable && oldVariable.value != newVariable.value) {
        Homey.log('-----Trigger variable changed-----');
        Homey.manager('flow').trigger('if_variable_changed', { "variable" : newVariable.name, "value": newVariable.value }, newVariable);
        Homey.manager('flow').trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
        Homey.manager('flow').trigger('if_one_of_variable_changed', { "variable" : newVariable.name, "value": newVariable.value }, newVariable);
    }
  
    if (newVariable && newVariable.type == 'boolean') {
        Homey.log('-----Trigger boolean changed-----');
        Homey.manager('settings').set('boolValueChanged', newVariable);
    }

    if (newVariable && newVariable.type == 'number') {
        Homey.log('-----Trigger number changed-----');
        Homey.manager('flow').trigger('if_number_variable_changed', { "variable" : newVariable.name, "value": newVariable.value }, {oldVariable:oldVariable, newVariable: newVariable});
    }
    if (newVariable) {
        Homey.log('-----Trigger set variable-------');
        Homey.manager('flow').trigger('if_variable_set', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
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

function getVariables() {
    var varCollection = Homey.manager("settings").get('variables');
    Homey.log('----Get Variables----');
    Homey.log(varCollection);
    Homey.log('---------------------');
    if (varCollection === undefined) {
        return [];
    }
    return varCollection;
}