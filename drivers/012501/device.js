'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class P012501 extends ZwaveDevice {
	onMeshInit() {
		
		this.enableDebug();
        this.printNode();
		
		this.registerCapability('locked', 'DOOR_LOCK');
		
		if (this.node.CommandClass.COMMAND_CLASS_NOTIFICATION) {
		this.registerCapability('alarm_contact', 'NOTIFICATION',{
		  getOnStart: false,
      });
		}
		
		if (!this.hasCommandClass('NOTIFICATION') && this.hasCapability('alarm_contact')) {
        this.removeCapability('alarm_contact').catch(this.error);
        }
	  
		if (this.node.CommandClass.COMMAND_CLASS_BATTERY) {
        this.registerCapability('measure_battery', 'BATTERY', {
        getOnStart: false,
      });
		}
		if (!this.hasCommandClass('BATTERY') && this.hasCapability('measure_battery')) {
        this.removeCapability('measure_battery').catch(this.error);
        }
	
	}
}
module.exports = P012501;
