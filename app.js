'use strict';

const Homey = require('homey');

class POPP extends Homey.App {

	onInit() {

		this.log('POPP app is running...');

		// Register flows
		// Condition
		this.homey.flow.getConditionCard('alarm_window_open')
			.registerRunListener((args) => {
				if (!args.device.hasCapability('alarm_window_open')){
					throw new Error('Window open feature has been disabled');
				}

				return args.device.getCapabilityValue('alarm_window_open');
			});
		this.homey.flow.getConditionCard('mounting_mode')
			.registerRunListener((args) => args.device.getCapabilityValue('mounting_mode_active'));
		this.homey.flow.getConditionCard('popp_thermostat_mode')
			.registerRunListener((args) => args.device.getCapabilityValue('popp_thermostat_mode') === args.mode);

		// Actions
		this.homey.flow.getActionCard('disable_window_open_trigger')
			.registerRunListener((args) => args.device.setWindowOpenTrigger(false));
		this.homey.flow.getActionCard('enable_window_open_trigger')
			.registerRunListener((args) => args.device.setWindowOpenTrigger(true));
		this.homey.flow.getActionCard('popp_thermostat_mode')
			.registerRunListener((args) => args.device.setThermostatMode(args.mode));

	}

}

module.exports = POPP;
