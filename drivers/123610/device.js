'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P123610 extends ZwaveDevice {
	onNodeInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P123610;
