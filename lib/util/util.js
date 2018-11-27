exports.findVariable = function (partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.type === type;
    }
}

exports.filterVariable = function(partialWord, type) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1 && element.type === type;
    }
}


exports.contains = function(partialWord) {
    return function(element) {
        return element.name.toLowerCase().indexOf(partialWord.toLowerCase()) > -1;
    }
}

exports.buildExpression = function (expression) {
    var variableManager = require('../variablemanager.js');
    var arr = [],
        re = /(\$.*?\$)/g,
        item;

    while (item = re.exec(expression))
        arr.push(item[1]);

    arr.forEach(function (item) {
        var variableName = item.replace(/\$/g, "");
        var variable = {};
        var date = new Date();
        if (variableName == 'timenow') {
            variable.value = Math.floor(Date.now() / 1000);
        }
        else if (variableName == '#timenow') {
            variable.value = Math.floor(Date.now() / 1000);
        }
        else if (variableName == '#DD') {
            variable.value = date.getDate();
        }
        else if (variableName == '#MM') {
            variable.value = date.getMonth() + 1;
        }
        else if (variableName == '#YYYY') {
            variable.value = date.getFullYear();
        }
        else if (variableName == '#HH') {
            var d = new Date(date);
            var offset = (new Date().getTimezoneOffset() / 60) * -1;
            var localHours = new Date(d.getTime() + offset);
            variable.value = localHours.getHours();
        }
        else if (variableName == '#mm') {
            variable.value = date.getMinutes();
        }
        else if (variableName == '#SS') {
            variable.value = date.getSeconds();
        }
        else {
            variable = variableManager.getVariable(variableName);
        }

        if(variable) {
          expression = expression.replace(item, variable.value);
        }
        else {
          throw new Error('Variablename ' + variableName + ' not found');
        }
    });
    return expression;
}
