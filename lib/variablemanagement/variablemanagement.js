var util = require('../util/util.js');

var variables = [];
var newVar = '';
var receivedVariables = [];
var receivedVariable;
var hasReceivedVariables = false;
var hasReceivedVariable = false;

module.exports = {
    init: function() {
        variables = Homey.manager("settings").get('variables');
        if (!variables) {
            variables = [];
        }

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
            type: type
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

    if (oldvariable && newVariable && oldvariable.value != newVariable.value) {
        Homey.manager('flow').trigger('if_variable_changed', { "variable" : newVariable.name, "value": newVariable.value }, newVariable);
        Homey.manager('flow').trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    }

    if (newVariable && newVariable.type == 'boolean') {
        Homey.manager('settings').set('boolValueChanged', newVariable);
    }
}