'use strict';

const Homey = require('homey');

class P700168Driver extends Homey.Driver {
    onInit() {
        super.onInit();

        this.rainOnTrigger = this.homey.flow.getDeviceTriggerCard('rain_on');
		this.rainOnTrigger.registerRunListener((args, state) => {
		return args.device.rainOnTrigger(args, state);
		});
		
		this.rainOffTrigger = this.homey.flow.getDeviceTriggerCard('rain_off');
		this.rainOffTrigger.registerRunListener((args, state) => {
		return args.device.rainOffTrigger(args, state);
		});
				
        this.heavyRainAlarmOnTrigger = this.homey.flow.getDeviceTriggerCard('heavyrain_alarm_on');
		this.heavyRainAlarmOnTrigger.registerRunListener((args, state) => {
		return args.device.heavyRainAlarmOnTrigger(args, state);
		});
				
		
        this.heavyRainAlarmOffTrigger = this.homey.flow.getDeviceTriggerCard('heavyrain_alarm_off');
		this.heavyRainAlarmOffTrigger.registerRunListener((args, state) => {
		return args.device.heavyRainAlarmOffTrigger(args, state);
		});
				
		
		
		
    }
}

module.exports = P700168Driver;

