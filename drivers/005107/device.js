'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P005107 extends ZwaveDevice {
	
  onNodeInit() {
	  
	this.enableDebug();
    this.printNode();
	
    this.registerCapability('onoff', 'SWITCH_BINARY');
    //this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
	
	if (this.node.CommandClass.COMMAND_CLASS_SENSOR_MULTILEVEL) {
      this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
        getOnStart: false,
      });
	  
 
    }
	
	if (!this.hasCommandClass('SENSOR_MULTILEVEL') && this.hasCapability('measure_temperature')) {
    this.removeCapability('measure_temperature').catch(this.error);
}
	
    }
	
	
	
}

module.exports = P005107;
