var util = require('./util/util.js');

var newVar = '';
var tokens = [];

const Homey = require('homey');

module.exports = {
    init: function() {
        var variables = getVariables();
        //create tokens
        variables.forEach(function(variable) {
            createToken(variable.name, variable.value, variable.type,);
        });

        Homey.ManagerSettings.on('set',
            function (action) {
                if (action == 'deleteall') {
                    deleteAllInsights();
                    deleteAllTokens();
                    Homey.ManagerSettings.set('variables', []);
                }
                if (action == 'changedvariables') {
                    const changeObject = Homey.ManagerSettings.get('changedvariables');
                    const newVariable = changeObject.variable;
                    updateVariable(newVariable.name, newVariable.value, newVariable.type, newVariable.remove);
                }
            });
    },
    getVariables: function() {
        return getVariables();
    },
    getVariable: function(variable) {
        return findVariable(getVariables(), variable);
    },
    updateVariable: function(name, value, type) {
        updateVariable(name, value, type);
    }
}

function updateVariable(name, value, type, remove = false) {
    const variables = getVariables();
    const oldVariable = findVariable(variables, name);
    if (oldVariable) {
        variables.splice(variables.indexOf(oldVariable), 1);
    }

    const newVariable = {
        name: name,
        value: value,
        type: type,
        remove: remove,
        lastChanged: getShortDate()
    };

    if (!remove) {
        variables.unshift(newVariable);
        Homey.ManagerApi.realtime('setting_changed', newVariable);
    }

    processValueChanged(variables, oldVariable, newVariable);
}

function findVariable(variables, variable) {
    return variables.filter(function (item) {
        return item.name === variable;
    })[0];
}
function processValueChanged(variables, oldVariable, newVariable) {
    Homey.ManagerSettings.set('variables', variables);

    if (newVariable && newVariable.remove) {
        removeInsights(newVariable.name);
        Homey.ManagerInsights.deleteLog(newVariable.name, function(err, state) {});
        removeToken(newVariable.name);
        return;
    }

    if (newVariable && !oldVariable) {
        createInsights(newVariable.name, newVariable.value, newVariable.type);
        createToken(newVariable.name, newVariable.value, newVariable.type);

    }

    if (newVariable && oldVariable && oldVariable.value !== newVariable.value) {
        updateInsights(newVariable.name, newVariable.value);
        updateToken(newVariable.name, newVariable.value);
        //    Homey.ManagerFlow.trigger('if_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
        //    Homey.ManagerFlow.trigger('debug_any_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
        //    Homey.ManagerFlow.trigger('if_one_of_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    }

    //if (newVariable && newVariable.type == 'boolean') {
    //    Homey.ManagerSettings.set('boolValueChanged', newVariable);
    //}

    //if (newVariable && newVariable.type == 'number') {
    //    Homey.log('-----Trigger num changed-----');
    //    Homey.ManagerSettings.set('numValueChanged', newVariable);
    //    Homey.ManagerFlow.trigger('if_number_variable_changed', { "variable": newVariable.name, "value": newVariable.value }, { oldVariable: oldVariable, newVariable: newVariable });
    //}

   //if (newVariable) {
    //    Homey.ManagerFlow.trigger('if_variable_set', { "variable": newVariable.name, "value": newVariable.value }, newVariable);
    //}
}
function createInsights(name, value, type) {
    if (type == 'number') {
        Homey.ManagerInsights
            .createLog(name,
                {
                    label: { en: name },
                    type: 'number',
                    units: { en: 'Value' },
                    decimals: 2,
                    chart: 'stepLine'
                },
                function (err, log) { log.createEntry(value); });
    }
    if (type == 'boolean') {
        Homey.ManagerInsights
            .createLog(name,
                {
                    label: { en: name },
                    type: 'boolean',
                    units: { en: 'Value' },
                    decimals: 0,
                    chart: 'column'
                },
                function (err, log) { log.createEntry(value); });
    }
}
function deleteAllInsights() {
    Homey.ManagerInsights.getLogs(function (err, logs) {
        console.log(logs);
        logs.forEach(function (log) {
            Homey.ManagerInsights.deleteLog(log, function (err, state) { });
        });
    });
}
function updateInsights(name, value) {
    Homey.ManagerInsights.getLog(name,
        function(err, log) {
            if (log) {
                log.createEntry(value);
            }
        });
}

function removeInsights(name) {
    Homey.ManagerInsights.getLog(name,
        function(err, log) {
            if (log) {
                Homey.ManagerInsights.deleteLog(log);
            }
        });
}

function deleteAllTokens() {
    for (var i = tokens.length - 1; i >= 0; i--) {
        tokens[i].unregister().then(() => {}).catch(err => { console.log(err); });
        tokens.splice(i, 1);
    }
}

function createToken(name, value, type) {
    if (type !== 'trigger') {
        var token = new Homey.FlowToken(name, { type: type, title: name });
        token.register()
            .then(() => {
                tokens.push(token);
                return token.setValue(value);
            })
            .catch(err => {
                this.error(err);
            });
    }
}

function removeToken(name) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            tokens[i].unregister().then(() => {}).catch(err => { console.log(err); });
            tokens.splice(i, 1);
        }
    }
}

function updateToken(name, value) {
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].id === name) {
            tokens[i].setValue(value);
        }
    }
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
