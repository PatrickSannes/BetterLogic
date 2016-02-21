angular.module('variableApp', ['smart-table'])
    .controller('VariableSettingsController', function() {
        var vm = this;
        vm.variables = [];
        vm.displayedVariables = [];
        vm.errorMessage = '';
        vm.selected = {};
    vm.homey;
    
    vm.setHomey = function(homey) {
        vm.homey = homey;
        vm.homey.get('variables', function(err, variables) {
            console.log(variables);
            if (!vm.variables) {
                vm.variables = [];
            }
            vm.variables = variables;
            vm.displayedVariables = variables;
        });
    }
    vm.addVariable = function () {
        
        if (vm.variables && vm.variables.filter(function (e) { return e.name == vm.newVariable.name; }).length > 0) {
                vm.errorMessage = "Variable does already exist in database.";
                return;
        }
        console.log(vm.newVariable);
            var variable = {
                name: vm.newVariable.name,
                type: vm.newVariable.type,
                value: vm.newVariable.value
            };
        vm.variables.push(variable);
        vm.homey.set('variables', vm.variables);
        vm.errorMessage = '';
        vm.newVariable = {}
        };
        
        vm.removeVariable = function(index) {
            vm.variables.splice(index, 1);
            vm.homey.set('variables', vm.variables);
        };

        vm.editVariable = function(variable) {
            console.log(variable);
            vm.selected = angular.copy(variable);
        };

        vm.saveVariable = function(idx) {
            console.log(vm.selected);
            vm.variables[idx] = angular.copy(vm.selected);
            vm.reset();
            vm.displayedVariables = vm.variables;
            vm.homey.set('variables', vm.variables);
        };
        vm.reset = function() {
            vm.selected = {};
    };
  
        vm.selectUpdate = function(type) {
            console.log(type);
            if (type === 'bool') {
                vm.newVariable.value = false;
                return;
            }
            if (type === 'number') {
                vm.newVariable.value = 0;
                return;
        }
            console.log('lama');
            vm.newVariable.value = '';
        return;
    }

        vm.getTemplate = function(variable) {
            if (variable.name === vm.selected.name && variable.type === vm.selected.type) return 'edit';
            else return 'display';
        };
    });