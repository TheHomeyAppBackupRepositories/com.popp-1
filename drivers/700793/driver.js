'use strict';

const Homey = require('homey');

class P700793Device extends Homey.Driver {
    onInit() {
        super.onInit();

        this.resetMeter = this.homey.flow.getActionCard('POPE700793_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
		
    }
}

module.exports = P700793Device;