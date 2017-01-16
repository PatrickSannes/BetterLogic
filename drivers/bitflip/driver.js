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

        Homey.manager('settings').on('set', function (action) {
            if (action == 'boolValueChanged') {
                var changedVariable = Homey.manager("settings").get('boolValueChanged');
                Homey.log(changedVariable);
                if (changedVariable.type == 'boolean') {
                    var device = devices.find(function (dev) {
                        return dev.id == changedVariable.name;
                    });
                    if (device) {
                        module.exports.realtime(device, 'onoff', changedVariable.value);
                    }
                }
            }
        });
       
        callback();
    },
    capabilities: {
        onoff: {
            get: function (device_data, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    callback(null, variable.value);
                    return;
                }
                callback(null, false);
            },
            set: function (device_data, onoff, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    variableManager.updateVariable(device_data.id, onoff, device_data.type);
                 
                    self.realtime(device_data, 'onoff', onoff);
                    callback(null, onoff);
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
            var bools = variableManager.getVariables().filter(util.findVariable('', 'boolean'));

            var devices = [];

            bools.forEach(function (variable) {
                Homey.log(variable);
                var device = {
                        name: variable.name,
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




