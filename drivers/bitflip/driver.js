"use strict";

const Homey = require('homey');

var util = require('../../lib/util/util.js');
var variableManager = require('../../lib/variablemanager.js');

var devices = [];

class BitFlipDriver extends Homey.Driver {
  onInit() {
    this.log('BitFlipDriver initialized');
    devices = this.getDevices();

    Homey.ManagerSettings.on('set',
        function (action) {
            if (action == 'boolValueChanged') {
                const changedVariable = Homey.ManagerSettings.get('boolValueChanged');

                if (changedVariable.type == 'boolean') {
                    var device = devices.find(function (dev) {
                        return dev.getData().id == changedVariable.name;
                    });

                    if (device) {
                        device.setCapabilityValue('onoff', changedVariable.value);
                    }
                }
            }
            Promise.resolve();
        });
  }



  onPair( socket ) {

    socket.on('list_devices', function( data, callback ) {
        var vars = variableManager.getVariables();
        var bools = variableManager.getVariables().filter(util.findVariable('', 'boolean'));

        var devices = [];

        bools.forEach(function (variable) {
            console.log(variable);
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

        callback( null, devices );
    });

    socket.on("add_devices", function(device, callback) {
        devices.push(device);
    });
  }
}
module.exports = BitFlipDriver;
