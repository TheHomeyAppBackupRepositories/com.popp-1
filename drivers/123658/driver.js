'use strict';

const Homey = require('homey');

class P123658Device extends Homey.Driver {
    onInit() {
        super.onInit();

        this.resetMeter = this.homey.flow.getActionCard('POP_123658_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
		
    }
}

module.exports = P123658Device;