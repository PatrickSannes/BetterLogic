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
                Homey.log(1);
                receivedVariables = Homey.manager("settings").get('variables');
                hasReceivedVariables = true;
            }
            if (variableName == 'changedVariable') {
                Homey.log(2);
                receivedVariableName = Homey.manager("settings").get('changedVariable');
                hasReceivedVariableName = true;
            }
            if (hasReceivedVariables && hasReceivedVariableName) {
                variables = receivedVariables;
                Homey.log(receivedVariables);
                Homey.log(receivedVariableName);
                hasReceivedVariables = false;
                hasReceivedVariableName = false;
            }
        });
    },
    getVariables: function() {
        return variables;
    }
}