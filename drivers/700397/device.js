 'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P700397 extends ZwaveDevice {
	onNodeInit() {
		this.enableDebug();
		this.printNode();
		
		this._sceneTrigger = this.driver.sceneTrigger;
				
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');
		
	this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
			if (report.hasOwnProperty('Properties1') &&
				report.Properties1.hasOwnProperty('Key Attributes') &&
				report.hasOwnProperty('Scene Number')) {
				const data = {
					button: report['Scene Number'].toString(),
					scene: report.Properties1['Key Attributes'],
				};
				this._sceneTrigger.trigger(this, null, data).catch(this.error);
			}
			
		});

     
    this.registerCapabilityListener('button.reset_meter', async () => 
		    {
		    	// Register button. Maintenance action button was pressed, return a promise
				if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
				{
					this.log('Maintainance button METER_RESET pushed.');
					return await this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({});

				}
				this.log('Does not support meter resets, or not a valid node.');
				return Promise.reject('The device could not be reset');
		    }	
	    );
	}
	
	resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				this.log('Action card METER_RESET triggered');
				this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
				
			} else return false;
	};
	
 async sceneRunListener(args, state) {
			if (!args) throw new Error('No arguments provided');
			if (!state) throw new Error('No state provided');

			if (args.button && state.button
				&& args.scene && state.scene) {
				return (args.button === state.button && args.scene === state.scene);
    } 			throw new Error('Button or scene undefined in args or state');
  }

}
module.exports = P700397;
