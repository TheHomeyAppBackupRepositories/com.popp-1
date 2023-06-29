'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P123580 extends ZwaveDevice {
	onMeshInit() {
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	}
}
module.exports = P123580;
