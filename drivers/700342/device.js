'use strict';


const { ZwaveDevice } = require('homey-zwavedriver');

class P700342 extends ZwaveDevice {
	onNodeInit() {
		
		  
	    this.enableDebug();
        this.printNode();
	
		this.registerCapability('alarm_smoke', 'SENSOR_BINARY');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
		
	}
}
module.exports = P700342;
