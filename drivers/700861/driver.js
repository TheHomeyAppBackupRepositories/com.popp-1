'use strict';

const Homey = require('homey');

class P700861Driver extends Homey.Driver {
    onInit() {
        super.onInit();

      //  this.batteryTrigger = this.homey.flow.getDeviceTriggerCard('POPE009303_battery_full');
        this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('POPE700861_scene');
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
		
    });
		
          
            }
}

module.exports = P700861Driver;

