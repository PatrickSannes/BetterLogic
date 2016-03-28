exports.findVariable = function (partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.type === type;
    }
}

exports.filterVariable = function(partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.query.toLowerCase()) > -1 && element.type === type;
    }
}


exports.contains = function(partialWord) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.query.toLowerCase()) > -1;
    }
}

exports.buildExpression = function (expression) {
    var variableManager = require('../variablemanagement/variablemanagement.js');
    var arr = [],
        re = /(\$.*?\$)/g,
        item;
    
    while (item = re.exec(expression))
        arr.push(item[1]);
    Homey.log(arr);
    
    arr.forEach(function (item) {
        var variableName = item.replace(/\$/g, "");
        var variable = {};
        Homey.log("Variable Name: " + variableName);
        if (variableName == 'timenow') {
            variable.value = Math.floor(Date.now() / 1000);
        } else {
            variable = variableManager.getVariable(variableName);
        }
        Homey.log("Variable value: " + variable.value);
        expression = expression.replace(item, variable.value);
    });
    return expression;
}