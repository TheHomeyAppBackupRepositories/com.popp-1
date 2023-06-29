'use strict';

const Homey = require('homey');

class P005206Driver extends Homey.Driver {
    onInit() {
        super.onInit();
		 this.dewPointTrigger = this.homey.flow.getDeviceTriggerCard('POPE005206_dewpoint_value');;
		 this.resetMeter = this.homey.flow.getActionCard('POPE005206_reset_meter')
		this.resetMeter.registerRunListener((args, state) => {
            return args.device.resetMeterRunListener(args, state);
		});
    }
}

module.exports = P005206Driver;