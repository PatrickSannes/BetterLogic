var util = require('../util/util.js');

var variables = [];
var newVar = '';
var receivedVariables = [];
var receivedVariableName = '';
var hasReceivedVariables = false;
var hasReceivedVariableName = false;

module.exports = {
    init: function() {
        variables = Homey.manager("settings").get('variables');
        Homey.log(variables);
        Homey.manager('settings').on('set', function(variableName) {
            if (variableName == 'variables') {
                receivedVariables = Homey.manager("settings").get('variables');
                hasReceivedVariables = true;
            }
            if (variableName == 'changedVariable') {
                receivedVariableName = Homey.manager("settings").get('changedVariable');
                hasReceivedVariableName = true;
            }
            if (hasReceivedVariables && hasReceivedVariableName) {
                var oldVariable = findVariable(variables, receivedVariableName);
                var newVariable = findVariable(receivedVariables, receivedVariableName);
                variables = receivedVariables;
                hasReceivedVariables = false;
                hasReceivedVariableName = false;
                triggerValueChanged(oldVariable, newVariable);
            }
        });
    },
    getVariables: function() {
        return variables;
    },
    updateVariable: function (variable, value, type) {
        var oldVariable = findVariable(variables, variable);
        
        if (oldVariable) {
            if (oldVariable.value == value) {
                return;
            }
            variables.splice(variables.indexOf(oldVariable), 1);
        }

        var newVariable = {
            name: variable,
            value: value,
            type: type
        }
        variables.unshift(newVariable);

        Homey.manager('settings').set('variables', variables);
        triggerValueChanged(oldVariable, newVariable);
    }
}

function findVariable(variables, variable) {
    return variables.filter(function (item) {return item.name === variable;
    })[0];
}
function triggerValueChanged(oldvariable, newVariable) {
    if (!oldvariable || oldvariable.value != newVariable.value) {
        Homey.manager('flow').trigger('if_variable_changed', { "variable" : newVariable.variable, "value": newVariable.value }, {});
        Homey.manager('flow').trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, {"event":"123"});
    }
}