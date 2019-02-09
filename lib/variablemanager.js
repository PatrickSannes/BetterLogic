var util = require('./util/util.js');
var FlowCardActionFactory = require('./flow/FlowCardActionFactory.js');
var FlowCardConditionFactory = require('./flow/FlowCardConditionFactory.js');
var FlowCardTriggerFactory = require('./flow/FlowCardTriggerFactory.js');

var newVar = '';
var tokens = [];

const Homey = require('homey');

module.exports = {
    init: function() {
        var variables = getVariables();

        FlowCardActionFactory.CreateFlowCardActions(this);
        FlowCardConditionFactory.CreateFlowCardConditions(this);
        FlowCardTriggerFactory.CreateFlowCardTriggers(this);

        //create tokens
        variables.forEach(function(variable) {
            createToken(variable.name, variable.value, variable.type);
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
        createOrUpdateInsights(newVariable.name, newVariable.value, newVariable.type);
        createToken(newVariable.name, newVariable.value, newVariable.type);

    }

    if (newVariable && oldVariable && oldVariable.value !== newVariable.value) {
        createOrUpdateInsights(newVariable.name, newVariable.value, newVariable.type);
        updateToken(newVariable.name, newVariable.value);

        getTrigger('if_variable_changed').trigger({ "variable": newVariable.name, "value": newVariable.value }, newVariable);
        getTrigger('debug_any_variable_changed').trigger({ "variable": newVariable.name, "value": newVariable.value }, newVariable);
        getTrigger('if_one_of_variable_changed').trigger({ "variable": newVariable.name, "value": newVariable.value }, newVariable);
    }

    if (newVariable && newVariable.type == 'boolean') {
       Homey.ManagerSettings.set('boolValueChanged', newVariable);
    }

    if (newVariable && newVariable.type == 'number') {
       Homey.ManagerSettings.set('numValueChanged', newVariable);
       getTrigger('if_number_variable_changed').trigger({ "variable": newVariable.name, "value": newVariable.value }, { oldVariable: oldVariable, newVariable: newVariable });
    }

   if (newVariable) {
       getTrigger('if_variable_set').trigger({ "variable": newVariable.name, "value": newVariable.value }, newVariable);
    }
}

function getTrigger(name)
{
  return Homey.ManagerFlow.getCard('trigger', name);
}

async function createOrUpdateInsights(name, value, type) {
  // no insights for string
  if(type == 'string') {
    return;
  }

  let log;
  try {
    log = await Homey.ManagerInsights.getLog(name);
    console.log("else createEntry  > " + value);
  } catch(e) {
    log = await Homey.ManagerInsights.createLog(name, GetInsightOptions(name, type));
    console.log("if createLog > createEntry > " + value);
  }

  try {
    await log.createEntry(value);
  } catch(err) {
    console.log(err);
  }
};

function GetInsightOptions(name, type)
{
    if (type == 'number')
    {
        return {
          title: { en: name },
          type: 'number',
          units: { en: 'Value' },
          decimals: 2,
          chart: 'stepLine'
        };
    }
    else if (type == 'boolean')
    {
        return {
          title: { en: name },
          type: 'boolean',
          units: { en: 'Value' },
          decimals: 0,
          chart: 'column'
        };
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
                console.log(type);
                console.log(err);
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

    if(!Array.isArray(varCollection)) {
      console.log('varCollection is not array');
      return [];
    }

    if (!varCollection || varCollection === undefined) {
        return [];
    }
    return varCollection;
}
