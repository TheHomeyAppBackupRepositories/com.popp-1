'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P004001 extends ZwaveDevice {
	onNodeInit() {
		
		this.printNode();
		this.enableDebug();
		
		this.registerCapability('onoff', 'BASIC');
		this.registerCapability('alarm_smoke', 'SENSOR_BINARY');
		this.registerCapability('alarm_battery', 'BATTERY', {
			getOpts: {
				getOnStart: true
			}
		});
		
      
		
	}
}
module.exports = P004001;
