"use strict";
var util = require('../../lib/util/util.js');
var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

var devices = [];

var self = module.exports =  {
    init: function(devices_data, callback) {
        Homey.log(devices_data);
        for (var x = 0; x < devices_data.length; x++) {
            devices.push(devices_data[x]);
        }

        Homey.manager('settings').on('set', function(action) {
            if (action == 'numberValueChanged') {
                var changedVariable = Homey.manager("settings").get('numberValueChanged');
                if (changedVariable.type == 'number') {
                    module.exports.realtime({ id: changedVariable.name }, 'dim', changedVariable.value);
                }
            }
        });
       
        callback();
    },
    capabilities: {
        dim: {
            get: function(device_data, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    callback(null, variable.value);
                    return;
                }
                callback(null, false);
            },
            set: function (device_data, dim, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    variableManager.updateVariable(device_data.id, dim, device_data.type);
                    callback(null, dim);
                    return;
                } else {
                    callback(null, false);
                }
            }
        }
    },
    pair : function(socket) {
        
        socket.on('list_devices', function (data, callback) {
            Homey.log('list devices');
            var vars = variableManager.getVariables();
            Homey.log(vars);
            var numbers = variableManager.getVariables().filter(util.findVariable('', 'number'));

            var devices = [];

            numbers.forEach(function (variable) {
                Homey.log(variable);
                var device = {
                        name: variable.name,
                        state: {dim : variable.value
                    },
                    data: {
                        id: variable.name,
                        type: variable.type,
                        value: variable.value
                    }
                }
                devices.push(device);

            });
            Homey.log(devices);
            callback(null, devices);

        });
        socket.on("add_device", function(device, callback) {

            Homey.log('add device');

            // Store device globally
            devices.push(device);

        });
    }
}




