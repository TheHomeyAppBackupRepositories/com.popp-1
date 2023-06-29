'use strict';


const { ZwaveDevice } = require('homey-zwavedriver');

class P701479 extends ZwaveDevice {
	onMeshInit() {
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}
module.exports = P701479;
