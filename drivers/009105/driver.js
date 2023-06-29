'use strict';

const Homey = require('homey');

class P009105Device extends Homey.Driver {
    onInit() {
        super.onInit();

        this.resetMeter = this.homey.flow.getActionCard('POPE009105_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
		
		
    }
}

module.exports = P009105Device;