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
            if (action == 'numValueChanged') {
                var changedVariable = Homey.manager("settings").get('numValueChanged');
                Homey.log(changedVariable);
                if (changedVariable.type == 'number') {
                    var device = devices.find(function (dev) {
                        return dev.id == changedVariable.name;
                    });
                    if (device) {
                        module.exports.realtime(device, 'numslide', changedVariable.value);
                    }
                }
            }
        });
       
        callback();
    },
    capabilities: {
        numslide: {
            get: function (device_data, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    callback(null, variable.value);
                    return;
                }
                callback(null, false);
            },
            set: function (device_data, numslide, callback) {
                var variable = variableManager.getVariable(device_data.id);
                if (variable) {
                    variableManager.updateVariable(device_data.id, numslide, device_data.type);
                 
                    self.realtime(device_data, 'numslide', numslide);
                    callback(null, numslide);
                    return;
                } else {
                    callback(null, false);
                }
            }
        }
    },
    pair : function (socket) {
        var myData;

        socket.on('start', function (data, callback) {
            myData = data;
        });

        socket.on('list_devices', function (data, callback) {
            Homey.log('list devices');
            Homey.log(myData);
            var vars = variableManager.getVariables();
            Homey.log(vars);
            var nums = variableManager.getVariables().filter(util.findVariable('', 'number'));

            var devices = [];

            nums.forEach(function (variable) {
                Homey.log(variable);
                var device = {
                    name: variable.name,
                    state: { numslide: variable.value },
                    data: {
                        id: variable.name,
                        type: variable.type,
                        value: variable.value
                    },
                    capabilitiesOptions: {
                        numslide: {
                            title:variable.name,
                            min:myData.min,
                            max: myData.max,
                            step: myData.step
                        }
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




