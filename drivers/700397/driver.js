'use strict';

const Homey = require('homey');

class P700397Device extends Homey.Driver {
    onInit() {
        super.onInit();

        this.resetMeter = this.homey.flow.getActionCard('POPE700397_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
		this.sceneTrigger = this.homey.flow.getDeviceTriggerCard('POPE700397_scene')
		this.sceneTrigger.registerRunListener((args, state) => {
           return args.device.sceneRunListener(args, state);
        });
		
		
    }
}

module.exports = P700397Device;