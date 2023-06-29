'use strict';


const { ZwaveDevice } = require('homey-zwavedriver');

class P009402 extends ZwaveDevice {
	onNodeInit() {
		
		  
	    this.enableDebug();
        this.printNode();
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('alarm_smoke', 'SENSOR_BINARY');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
		
	}
}
module.exports = P009402;
