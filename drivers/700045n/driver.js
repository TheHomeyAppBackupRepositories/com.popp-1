'use strict';

const Homey = require('homey');

class P700045nDriver extends Homey.Driver {
    onInit() {
        super.onInit();

     
        this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('POPE700045n_scene');
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
	});	   
	this.doorUnlockTrigger = this.homey.flow.getDeviceTriggerCard('POPE700045n_door_lock_on');  
    this.doorUnlockTrigger.registerRunListener((args, state) => {
      return args.device.doorUnlockTrigger(args, state);
    });
	this.doorLockTrigger = this.homey.flow.getDeviceTriggerCard('POPE700045n_door_lock_off');  
    this.doorLockTrigger.registerRunListener((args, state) => {
      return args.device.doorLockTrigger(args, state);
    });
	
	
}
}
module.exports = P700045nDriver;

