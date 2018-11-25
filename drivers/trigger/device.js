'use strict';

const Homey = require('homey');
var variableManager = require('../../lib/variablemanager.js');


class TriggerDevice extends Homey.Device {

    onInit() {
        this.registerCapabilityListener('button', this.onCapabilityButton.bind(this))
    }

    onCapabilityButton( value, opts, callback ) {
        var variable = variableManager.getVariable(this.getData().id);

        if (variable) {
            variableManager.updateVariable(this.getData().id, new Date().toISOString(), this.getData().type);

            return Promise.resolve(true);
        } else {
            return Promise.reject( new Error('Trigger not found!') );
        }

        return Promise.reject( new Error('Triggering the device failed!') );
    }

}

module.exports = TriggerDevice;
