'use strict';


const { ZwaveDevice } = require('homey-zwavedriver');

class P009501 extends ZwaveDevice {
	onMeshInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P009501;
