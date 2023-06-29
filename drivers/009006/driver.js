'use strict';

const Homey = require('homey');

class P009006Device extends Homey.Driver {
    onInit() {
        super.onInit();

        this.resetMeter = this.homey.flow.getActionCard('POPE009006_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
		
		
    }
}

module.exports = P009006Device;