'use strict';

//const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P700045n extends ZwaveDevice {
  onNodeInit() {
	  
	 this.enableDebug();
	this.printNode();
		
      
     
	this._sceneTrigger = this.driver.sceneTrigger;
	this._doorLockTrigger = this.driver.doorLockTrigger;
	this._doorUnlockTrigger = this.driver.doorUnlockTrigger;
	
	
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');

	this.registerCapability('keypad_access', 'DOOR_LOCK', {
    report: 'DOOR_LOCK_OPERATION_SET',
        reportParser: report => {
          if (report['Door Lock Mode'] === 'Door Unsecured') {
          this.setCapabilityValue('keypad_access', true).catch(this.error);
		  this._doorUnlockTrigger.trigger(this).catch(this.error);
              }
			  else {      
		  if (report['Door Lock Mode'] === 'Door Secured') {
          this.setCapabilityValue('keypad_access', false).catch(this.error);
		  this._doorLockTrigger.trigger(this).catch(this.error);
              }
              return null;	
			}}
          });
	
	this.registerCapability('alarm_keypad_bell', 'BASIC');
	 this.registerReportListener('BASIC', 'BASIC_SET', report => {
      this.setCapabilityValue('alarm_keypad_bell', !!report.Value).catch(this.error);
	 });
	 
	this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
			if (report.hasOwnProperty('Properties1') &&
				report.hasOwnProperty('Scene Number')) {
				const data = {
					scene: report['Scene Number'].toString()
				};
				this._sceneTrigger.trigger(this, null, data).catch(this.error);
				
			}
			
		});
	
 
  }
  async sceneRunListener(args, state) {
			if (!args) throw new Error('No arguments provided');
			if (!state) throw new Error('No state provided');

			if (args.scene && state.scene) {
				return (args.scene === state.scene);
    } 			throw new Error('Button or scene undefined in args or state');
  }


}
module.exports = P700045n;
