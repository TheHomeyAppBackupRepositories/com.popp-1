'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');
const PoppSpecificThermostatCluster = require('./PoppSpecificThermostatCluster');

class PThermostat extends ZigBeeDevice {

	async onNodeInit({ zclNode, node }) {

		await super.onNodeInit({ zclNode, node });

		// Setpoint of thermostat
		if (this.hasCapability('target_temperature')) {
			this.registerCapability('target_temperature', PoppSpecificThermostatCluster, {
				set: 'setPoppSetpoint',
				get: 'occupiedHeatingSetpoint',
				report: 'occupiedHeatingSetpoint',
				setParser(value) {
					return {
						setpointType: this.hasCapability('popp_thermostat_mode') ? this.getCapabilityValue('popp_thermostat_mode') : 'fast', // If no setting is available, default to fast mode
						heatingSetpoint: value * 100,
					};
				},
				reportParser(value) {
					return Math.round((value / 100) * 10) / 10;						
				},
				reportOpts: {
					configureAttributeReporting: {
						minInterval: 0,
						maxInterval: 3600,
						minChange: 0,
					},
				},
			});
		}

		// local temperature
		if (this.hasCapability('measure_temperature')) {
			this.registerCapability('measure_temperature', PoppSpecificThermostatCluster, {
				get: 'localTemperature',
				report: 'localTemperature',
				reportParser(value) {
					if (value === -32768) {
						return null;
					}
					return value / 100;
				},				
				reportOpts: {
					configureAttributeReporting: {
						minInterval: 0,
						maxInterval: 3600,
						minChange: 0,
					},
				},
			});
		}

		// battery reporting
		if (this.hasCapability('measure_battery')) {
			this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {				
				reportOpts: {
					configureAttributeReporting: {
						minInterval: 0,
						maxInterval: 3600,
						minChange: 1,
					},
				},
			});
		}

		// Fast mode
		if (this.hasCapability('popp_thermostat_mode')) {
			if (!this.hasCapability('target_temperature')) {
				throw new Error('Fast mode capability cannot be used without temperature setting!')
			}
			this.registerCapability('popp_thermostat_mode', PoppSpecificThermostatCluster, {
				set: 'setPoppSetpoint',
				setParser(value) {
					return {
						setpointType: value,
						heatingSetpoint: this.getCapabilityValue('target_temperature') * 100,
					};
				},
			});
		}
	}
	
	async setThermostatMode(value) {
		await this.setCapabilityValue('popp_thermostat_mode', value);
		return this.zclNode
			.endpoints[this.getClusterEndpoint(PoppSpecificThermostatCluster)]
			.clusters[PoppSpecificThermostatCluster.NAME]
			.setPoppSetpoint({
				setpointType: value,
				heatingSetpoint: this.getCapabilityValue('target_temperature') * 100,
			});
	}
}

module.exports = PThermostat;

