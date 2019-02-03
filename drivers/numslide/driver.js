"use strict";

const Homey = require('homey');

var util = require('../../lib/util/util.js');
var variableManager = require('../../lib/variablemanager.js');

var devices = [];

class NumSlideDriver extends Homey.Driver {
  onInit() {
      this.log('NumSlideDriver initialized');
      devices = this.getDevices();

      Homey.ManagerSettings.on('set',
          function (action) {
              if (action == 'numValueChanged') {
                  const changedVariable = Homey.ManagerSettings.get('numValueChanged');

                  if (changedVariable.type == 'number') {
                      var device = devices.find(function (dev) {
                          return dev.getData().id == changedVariable.name;
                      });

                      if (device) {
                          device.setCapabilityValue('dim', changedVariable.value);
                      }
                  }
              }
              Promise.resolve();
          });
  }

  onPair( socket ) {
    var myData;

    socket.on('start', function (data, callback) {
        myData = data;
    });

    socket.on('list_devices', function (data, callback) {
        var nums = variableManager.getVariables().filter(util.findVariable('', 'number'));
        var devices = [];

        nums.forEach(function (variable) {
            console.log(variable);
            var device = {
                name: variable.name,
                state: { dim: variable.value },
                data: {
                    id: variable.name,
                    type: variable.type
                },
                capabilitiesOptions: {
                    dim: {
                        title: variable.name,
                        min: myData.min*1,
                        max: myData.max*1,
                        step: myData.step*1
                    }
                }
            }
            devices.push(device);

        });

        callback(null, devices);
    });
    socket.on("add_device", function(device, callback) {
        devices.push(device);
    });
  }
}
module.exports = NumSlideDriver;
