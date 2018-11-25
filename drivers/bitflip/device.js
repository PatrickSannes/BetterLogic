'use strict';

const Homey = require('homey');
var variableManager = require('../../lib/variablemanager.js');


class BitFlipDevice extends Homey.Device {

    onInit() {
        this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this))
    }

    onCapabilityOnOff( value, opts, callback ) {
        var variable = variableManager.getVariable(this.getData().id);
        if (variable) {
            variableManager.updateVariable(this.getData().id, value, this.getData().type);

            return Promise.resolve(true);
        } else {
            return Promise.reject(new Error('Variable not found!'));
        }
    }

}

module.exports = BitFlipDevice;
