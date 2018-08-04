'use strict';

var variableManager = require('./lib/variablemanager.js');
const Homey = require('homey');

class BetterLogic extends Homey.App {
	
	onInit() {
        this.log('BetterLogic is running...');
	    variableManager.init();
	}
	
}

module.exports = BetterLogic;