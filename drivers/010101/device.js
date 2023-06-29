'use strict';

//const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P010101 extends ZwaveDevice {
	onMeshInit() {
		
		
		this.enableDebug();
        this.printNode();
		
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT');
		this.registerCapability('measure_battery', 'BATTERY');
	}
}
module.exports = P010101;
