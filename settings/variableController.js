angular.module('variableApp', ['smart-table'])
    .controller('VariableSettingsController', function($scope) {
        var vm = this;
        vm.errorMessage = '';
        vm.selected = {};
        vm.homey;
    
        vm.setHomey = function(homey, scope) {
            vm.homey = homey;
            vm.homey.get('variables', function(err, newVariables) {
                console.log(newVariables);
                if (!newVariables) {
                    newVariables = [];
                }
                scope.$apply(function() {
                    vm.variables = newVariables;
                    vm.displayedVariables = newVariables;
                });
            });
            vm.homey.on('setting_changed', function(name) {
                vm.homey.get('variables', function(err, newVariables) {
                    console.log(newVariables);
                    if (!newVariables) {
                        newVariables = [];
                    }
                    $scope.$apply(function() {
                        vm.variables = newVariables;
                        vm.displayedVariables = newVariables;
                    });

                    console.log(vm.variables);
                });
            });
        }
        vm.addVariable = function() {
            if (vm.variables && vm.variables.filter(function(e) { return e.name == vm.newVariable.name; }).length > 0) {
                vm.errorMessage = "Variable does already exist in database.";
                return;
            }
            var variable = {
                name: vm.newVariable.name,
                type: vm.newVariable.type,
                value: vm.newVariable.value,
                hasInsights: vm.newVariable.hasInsights,
                lastChanged: getShortDate(),
                remove:false
            };
            vm.variables.push(variable);
            storeVariable(angular.copy(vm.variables), variable);
            vm.errorMessage = '';
            vm.newVariable = {}
        };
        vm.deleteAll = function() {
            vm.homey.set('variables',[] );
            vm.variables = [];
            vm.displayedVariables = [];
        }
        vm.removeVariable = function (index) {
            var toDeleteVariable = vm.variables[index];
            vm.variables.splice(index, 1);
            toDeleteVariable.remove = true;
            storeVariable(angular.copy(vm.variables), toDeleteVariable);
        };

        vm.editVariable = function(variable) {
            vm.selected = angular.copy(variable);
        };

    vm.saveVariable = function (idx) {
        vm.selected.lastChanged = getShortDate();
        vm.variables[idx] = angular.copy(vm.selected);
        vm.displayedVariables = vm.variables;
        storeVariable(angular.copy(vm.variables), vm.selected);

        vm.reset();
        };
        vm.reset = function() {
            vm.selected = {};
        };

        vm.selectUpdate = function(type) {
            if (type === 'boolean') {
                vm.newVariable.value = false;
                return;
            }
            if (type === 'number') {
                vm.newVariable.value = 0;
                return;
            }
            vm.newVariable.value = '';
            return;
        }

        vm.getTemplate = function(variable) {
            if (variable.name === vm.selected.name && variable.type === vm.selected.type) return 'edit';
            else return 'display';
        };

        function storeVariable(variables, variable) {
            var changeObject = {
                variables: variables,
                variable: variable
            };

            vm.homey.set('changedVariables', changeObject);
        }
    });

function getShortDate() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}