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

        callback();
    },
    capabilities: {
        button: {
            set: function (device_data, button, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    variableManager.updateVariable(device_data.id, new Date().toISOString(), device_data.type);
                 
                    self.realtime(device_data, 'button', !button);
                    callback(null, !button);
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
            var bools = variableManager.getVariables().filter(util.findVariable('', 'trigger'));

            var devices = [];

            bools.forEach(function (variable) {
                Homey.log(variable);
                var device = {
                        name: variable.name,
                    data: {
                        id: variable.name,
                        type: variable.type
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




