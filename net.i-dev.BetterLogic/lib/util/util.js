exports.findVariable = function(partialWord, type) {
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