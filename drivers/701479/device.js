'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P701479 extends ZwaveDevice {
	onNodeInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P701479;
