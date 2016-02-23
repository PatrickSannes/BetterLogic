angular.module('variableApp', ['smart-table'])
    .controller('VariableSettingsController', function() {
        var vm = this;
        //vm.variables = [];
        //vm.displayedVariables = [];
        vm.errorMessage = '';
        vm.selected = {};
        vm.homey;
    
        vm.setHomey = function(homey,scope) {
            vm.homey = homey;
            vm.homey.get('variables', function(err, variables) {
                console.log(variables);
                if (!vm.variables) {
                    vm.variables = [];
            }
            scope.$apply(function() {
                    vm.variables = variables;
                    vm.displayedVariables = variables;
                });
            });
        //vm.homey.on('setVariable', function (variableName) {
        //    console.log('get an event');
        //    scope.$apply(function() {
        //        vm.variables = Homey.manager("settings").get('variables');;
        //        vm.displayedVariables = vm.variables;
        //    });
        //});

        }
        vm.addVariable = function() {
            if (vm.variables && vm.variables.filter(function(e) { return e.name == vm.newVariable.name; }).length > 0) {
                vm.errorMessage = "Variable does already exist in database.";
                return;
            }
            var variable = {
                name: vm.newVariable.name,
                type: vm.newVariable.type,
                value: vm.newVariable.value
            };
            vm.variables.push(variable);
            storeVariable(angular.copy(vm.variables), variable.name);
            vm.errorMessage = '';
            vm.newVariable = {}
        };
        vm.deleteAll = function() {
            vm.homey.set('variables', []);
            vm.variables = [];
            vm.displayedVariables = [];
        }
        vm.removeVariable = function (index) {
            var toDeleteVariable = vm.variables[index];
            vm.variables.splice(index, 1);
            storeVariable(angular.copy(vm.variables), toDeleteVariable.name);
        };

        vm.editVariable = function(variable) {
            vm.selected = angular.copy(variable);
        };

        vm.saveVariable = function(idx) {
            vm.variables[idx] = angular.copy(vm.selected);
            vm.displayedVariables = vm.variables;
            storeVariable(angular.copy(vm.variables), vm.selected.name);
            vm.reset();
        };
        vm.reset = function() {
            vm.selected = {};
        };

        vm.selectUpdate = function(type) {
            if (type === 'bool') {
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

    function storeVariable(variable, variableName) {
            vm.homey.set('variables', variable);
            vm.homey.set('changedVariable', variableName);
        }
    });