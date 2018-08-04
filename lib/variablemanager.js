var util = require('./util/util.js');

var newVar = '';
var insights = [];
var tokens = [];
const Homey = require('homey');

module.exports = {
    init: function() {
        Homey.ManagerInsights.getLogs(function(err, logs) {

            logs.forEach(function(log) {
                insights.push(log.name);
            });
            var variables = getVariables();
            //create tokens
            variables.forEach(function(variable) {
                if (variable.type !== 'trigger') {
                    var token = new Homey.FlowToken(variable.name, { type: variable.type, title: variable.name });
                    token.register()
                        .then(() => {
                            return token.setValue(variable.value);
                        })
                        .catch(err => {
                            this.error(err);
                        });
                }
            });
        });
        Homey.ManagerSettings.on('set', function (action) {
            if (action == 'changedVariables') {

                var changeObject = Homey.ManagerSettings.get('changedVariables');
                var newVariables = changeObject.variables;
                var newVariable = changeObject.variable;
                if (!newVariables) {
                    newVariables = [];
                }

                var oldVariables = getVariables();
                var oldVariable = findVariable(oldVariables, newVariable.name);
                processValueChanged(newVariables, oldVariable, newVariable);
            }
            if (action == 'deleteAll') {
                Homey.ManagerInsights.getLogs(function (err, logs) {
                    logs.forEach(function (log) {
                        Homey.ManagerInsights.deleteLog(log.name, function (err, state) { });
                    });
                });
                insights = [];

                var variables = getVariables();
                variables.forEach(function (variable) {
                    Homey.ManagerFlow
                        .unregisterToken(variable.name,
                            function callback(err) {
                                if (err) return console.error(err);
                            });
                    tokens = [];
                });
                Homey.ManagerSettings.set('variables', []);
            }
        });
    },
    getVariables: function() {
        return getVariables();
    },
    getVariable: function(variable) {
        return findVariable(getVariables(), variable);
    },
    updateVariable: function(variable, value, type) {
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
        Homey.ManagerApi.realtime('setting_changed', newVariable);
        processValueChanged(variables, oldVariable, newVariable);
    }
}

function findVariable(variables, variable) {
    return variables.filter(function (item) {
        return item.name === variable;
    })[0];
}
function processValueChanged(variables, oldVariable, newVariable) {
    Homey.ManagerSettings.set('variables', variables);
    if (newVariable && newVariable.remove) {
        Homey.ManagerInsights.deleteLog(newVariable.name, function (err, state) { });
        insights.splice(insights.indexOf(newVariable.name), 1);

        Homey.ManagerFlow
            .unregisterToken(newVariable.name,
                function callback(err) {
                    if (err) return console.error('setValue error:', err);
                });
        for (i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].id == newVariable.name) tokens.splice(i, 1);
        }
        return;
    }

    if (newVariable && (newVariable.type == 'number' || newVariable.type == 'boolean') && !logExists(newVariable.name)) {
        if (newVariable.type == 'number') {
            Homey.ManagerInsights
                .createLog(newVariable.name,
                    {
                        label: { en: newVariable.name },
                        type: 'number',
                        units: { en: 'Value' },
                        decimals: 2,
                        chart: 'stepLine'
                    }, function (err, state) { });
        }
        if (newVariable.type == 'boolean') {
            Homey.ManagerInsights
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

    if (newVariable && !oldVariable) {
        Homey.ManagerFlow.registerToken(newVariable.name, {
            type: newVariable.type,
            title: newVariable.name
        }, function (err, token) {
            if (err) return console.error('registerToken error:', err);

            token.setValue(newVariable.value, function (err) {
                if (err) return console.error('setValue error:', err);
            });
            tokens.push(token);
        });
        return;
    }

    if (newVariable) {
        var token = tokens.find(function (dev) {
            return dev.id == newVariable.name;
        });
        if (token) {
            token.setValue(newVariable.value,
                function (err) {
                    if (err) return console.error('setValue error:', err);
                });
        }
    }

    if (newVariable && logExists(newVariable.name) && (!oldVariable || oldVariable.value != newVariable.value)) {
        Homey.ManagerInsights.getLogs(function(logs) {
            console.log(logs);
        })
        Homey.ManagerInsights.getLog(newVariable.name, 
            function (log) {
                console.log(newVariable.name);
                log.createEntry(newVariable.value);
            });
        // Homey.ManagerInsights.createEntry(newVariable.name, newVariable.value, new Date(), function (err, success) { });
    }

    //if (oldVariable && newVariable && oldVariable.value != newVariable.value) {
    //    Homey.ManagerFlow.trigger('if_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    //    Homey.ManagerFlow.trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    //    Homey.ManagerFlow.trigger('if_one_of_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    //}

    //if (newVariable && newVariable.type == 'boolean') {
    //    Homey.ManagerSettings.set('boolValueChanged', newVariable);
    //}

    //if (newVariable && newVariable.type == 'number') {
    //    Homey.log('-----Trigger num changed-----');
    //    Homey.ManagerSettings.set('numValueChanged', newVariable);
    //}

    //if (newVariable && newVariable.type == 'number') {
    //    Homey.ManagerFlow.trigger('if_number_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, { oldVariable: oldVariable, newVariable: newVariable });
    //}
    //if (newVariable) {
    //    Homey.ManagerFlow.trigger('if_variable_set', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    //}
}

function logExists(variableName) {
    return insights.indexOf(variableName) > -1;
}


function getShortDate() {
    return new Date().toISOString();
}

function getVariables() {
    var varCollection = Homey.ManagerSettings.get('variables');
    console.log(varCollection);
    if (!varCollection || varCollection === undefined) {
        return [];
    }
    return varCollection;
}
