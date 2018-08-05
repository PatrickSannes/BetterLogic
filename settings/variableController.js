angular.module('variableApp', ['smart-table'])
    .controller('VariableSettingsController', function($scope) {
        var vm = this;
        vm.errorMessage = '';
        vm.showExportToggle = false;
        vm.showImportToggle = false;
        vm.importJson = '';
        vm.selected = {};
        vm.homey;

        vm.init = function(homey, scope) {
            vm.homey = homey;
            vm.homey.get('variables', function(err, newVariables) {
                console.log(newVariables);
                if (!newVariables) {
                    newVariables = [];
                }
                scope.$apply(function() {
                    vm.variables = newVariables;
                });
            });
            vm.homey.on('setting_changed', function (name) {
                console.log(name);
                vm.homey.get('variables', function(err, newVariables) {
                    if (!newVariables) {
                        newVariables = [];
                    }
                    scope.$apply(function() {
                        vm.variables = newVariables;
                    });
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
                lastChanged: getShortDate(),
                remove: false
            };
            vm.variables.push(variable);
            storeVariable(variable);
            vm.errorMessage = '';
            vm.newVariable = {}
        };
        vm.deleteAll = function() {
            vm.variables = [];
            deleteAllVariables();
        };
        vm.removeVariable = function(row) {
            var index = vm.variables.indexOf(row);
            var toDeleteVariable = vm.variables[index];
            toDeleteVariable.remove = true;
            vm.variables.splice(index, 1);
            storeVariable(toDeleteVariable);
        };

        vm.showExport = function() {
            vm.showExportToggle = !vm.showExportToggle;
        };
        vm.showImport = function() {
            vm.showImportToggle = !vm.showImportToggle;
        };

        vm.import = function() {
            var newVars = angular.fromJson(vm.importJson);
            vm.deleteAll();
            newVars.forEach(function(variable) {
                storeVariable(variable);
            });
            vm.variables = newVars;
        };

        vm.editVariable = function(variable) {
            vm.selected = angular.copy(variable);
        };

        vm.saveVariable = function(row) {
            vm.selected.lastChanged = getShortDate();
            var index = vm.variables.indexOf(row);
            var indexDisplay = $scope.displayedCollection.indexOf(row);
            vm.variables[index] = angular.copy(vm.selected);
            $scope.displayedCollection[indexDisplay] = angular.copy(vm.selected);
            storeVariable(vm.selected);
            vm.reset();
        };

        vm.triggerVariable = function(row) {
            vm.selected = angular.copy(row);
            vm.selected.lastChanged = getShortDate();
            vm.selected.value = getShortDate();

            var index = vm.variables.indexOf(row);
            var indexDisplay = $scope.displayedCollection.indexOf(row);

            vm.variables[index] = angular.copy(vm.selected);
            $scope.displayedCollection[indexDisplay] = angular.copy(vm.selected);
            storeVariable(vm.selected);
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

        function storeVariable(variable) {
            var changeObject = {
                variable: variable
            };
            vm.homey.set('changedvariables', changeObject, function (err) { console.log(err)});
        }

        function deleteAllVariables() {
            //I need to pass in this dummy or else it does not work....?
            var dummyVar = {
                name: "",
                type: "",
                value: "",
                lastChanged: getShortDate(),
                remove: false
            };
            var dummyChangedObject = {
                variable: dummyVar
            };

            vm.homey.set('deleteall', dummyChangedObject, function (err) { console.log(err)});            
        }
    });

function getShortDate() {
    return new Date().toISOString();
}

function setVariables(variables) {}