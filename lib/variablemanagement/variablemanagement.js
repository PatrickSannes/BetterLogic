var util = require('../util/util.js');

var newVar = '';
var insights = [];

module.exports = {
    init: function() {
        Homey.manager('insights').getLogs(function(err, logs) {
            logs.forEach(function (log) {
                //Homey.manager('insights').deleteLog(log.name, function (err, state) { });
                insights.push(log.name);
            });
        });

        Homey.manager('settings').on('set', function (action) {
            Homey.log('komt ie hier?');
            Homey.log(action);
            if (action == 'changedVariables') {
                
                var changeObject = Homey.manager("settings").get('changedVariables');
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
            if (action == 'deleteAll') {
                Homey.log('delete log?');
                Homey.manager('insights').getLogs(function (err, logs) {
                    logs.forEach(function (log) {
                        Homey.manager('insights').deleteLog(log.name, function (err, state) { });
                    });
                });
                insights = [];
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
            variables.splice(variables.indexOf(oldVariable), 1);
        } else {
            return;
        }

        var newVariable = {
            name: variable,
            value: value,
            type: type,
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
    if (newVariable && newVariable.remove) {
        Homey.manager('insights').deleteLog(oldVariable.name, function (err, state) { });
        insights.splice(insights.indexOf(oldVariable.name),1);
        return;
    }
    
    if (newVariable && (newVariable.type == 'number' || newVariable.type == 'boolean') && !logExists(newVariable.name)) {
        Homey.log('-----Insight added-----');
        Homey.log(newVariable);
        Homey.log('-----------------------');
        if (newVariable.type == 'number') {
            Homey.manager('insights')
                .createLog(newVariable.name,
                {
                label: { en: newVariable.name },
                type: 'number',
                units: { en: 'Value' },
                decimals: 2,
                chart:'stepLine'
                }, function(err, state) {});
        }
        if (newVariable.type == 'boolean') {
            Homey.manager('insights')
                .createLog(newVariable.name,
                {
                label: { en: newVariable.name },
                type: 'boolean',
                units: { en: 'Value' },
                decimals: 0,
                chart: 'column'
            }, function (err, state) { });
        }
        insights.push(newVariable.name);
    }
    
    if (newVariable && logExists(newVariable.name)) {
        Homey.log('-----Insight registererd-----');
        Homey.log(newVariable);
        Homey.log('-----------------------');

        Homey.manager('insights').createEntry(newVariable.name, newVariable.value, new Date(),  function(err, success) {});
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
    return new Date().toISOString();
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