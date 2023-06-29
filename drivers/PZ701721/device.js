'use strict';

const Homey = require('homey');
const { CLUSTER, Cluster, debug } = require('zigbee-clusters');
const PThermostat = require('../../lib/PThermostat');
const PoppThermostatUICluster = require('../../lib/PoppThermostatUICluster');
const PoppSpecificThermostatCluster = require('../../lib/PoppSpecificThermostatCluster');

Cluster.addCluster(PoppSpecificThermostatCluster);

class ThermostatDevice extends PThermostat {

    intervals = {};

    async onNodeInit({ zclNode, node }) {
        this.enableDebug();

        if (Homey.env.DEBUG === '1') {
            debug();
            this.debug('Debug mode enabled');
        }

        await super.onNodeInit({ zclNode, node });

        // Handle capability changes
        await this.addCapabilityIfNotPresent('popp_thermostat_mode', 'fast');
        await this.addCapabilityIfNotPresent('mounting_mode_active', false);
        await this.addCapabilityIfNotPresent('alarm_window_open', false);
        await this.addCapabilityIfNotPresent('window_open_trigger', false);

        // Set default values
        if (this.getCapabilityValue('popp_thermostat_mode') === null) {
            await this.setCapabilityValue('popp_thermostat_mode', 'fast').catch(this.error);
        }

              // Setup capabilities that were not setup in parent class
        if (this.hasCapability('mounting_mode_active')) {
            this.registerCapability('mounting_mode_active', PoppSpecificThermostatCluster, {
                get: 'mountingModeActive',
                report: 'mountingModeActive',
                reportParser: (value) => {
                    this.setSettings({ mountingMode: value }).catch(this.error);
                    return value;
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

        if (this.hasCapability('alarm_window_open')) {
            this.registerCapability('alarm_window_open', PoppSpecificThermostatCluster, {
                get: 'openWindowDetection',
                report: 'openWindowDetection',
                reportParser: (value) => {
                    return ['windowsOpen', 'externalOpen'].includes(value); // Simplified, but should be enough for most scenarios
                },
                getOpts: {
                    getOnStart: true,
                    getOnOnline: true,
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

        if (this.hasCapability('window_open_trigger')) {
            this.registerCapability('window_open_trigger', PoppSpecificThermostatCluster, {
				set: 'externalOpenWindowDetection',
                setParser: (value) => {
                    this.writeAttributeTimeout(PoppSpecificThermostatCluster.NAME, 'externalOpenWindowDetection', value, 'externalWindowOpenInterval').catch(this.error);

                    // Return null to not continue as there is no command to execute
                    return null;
                },
				report: 'externalOpenWindowDetection',
                reportOpts: {
                    configureAttributeReporting: {
                        minInterval: 0,
                        maxInterval: 3600,
                        minChange: 0,
                    },
                },
            });
        }
		
		 // Read settings from device
        await this.readSettings().catch(this.error);

        // Try to read initial values
        await this.readInitialValues().catch(this.error);

        // Setup flows
        // Actions are handled in the app

        // Conditions are handled in the app

        // Triggers
        // alarm_window_open_{false|true} is automatically triggered by Homey
        // mounting_mode_active_{false|true} is automatically triggered by Homey
    }

    onDeleted() {
        // Clear all intervals
        Object.keys(this.intervals).forEach(intervalName => this.homey.clearInterval(this.intervals[intervalName]));

        super.onDeleted();
    }
	
	 async setWindowOpenTrigger(value) {
		if (!this.hasCapability('window_open_trigger')) {
            throw new Error('Window open feature has been disabled');
        }
 
        await this.setCapabilityValue('window_open_trigger', value);
         await this.writeAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
            'externalOpenWindowDetection',
            value,
            'externalWindowOpenInterval'
        );
    }


async readInitialValues() {
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
          'occupiedHeatingSetpoint',
            (result) => this.setCapabilityValue('target_temperature', Math.round((result.occupiedHeatingSetpoint / 100) * 10) / 10).catch(this.error),
          'initialOccupiedHeatingSetpoint'
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
          'localTemperature',
            (result) => this.setCapabilityValue('measure_temperature', result.localTemperature === -32768 ? null : (result.localTemperature / 100)).catch(this.error),
          'initialLocalTemperature'
        );
        await this.readAttributeTimeout(
            CLUSTER.POWER_CONFIGURATION.NAME,
          'batteryPercentageRemaining',
            (result) => this.setCapabilityValue(
                'measure_battery',
                result.batteryPercentageRemaining <= 200 && result.batteryPercentageRemaining !== 255 ? Math.round(result.batteryPercentageRemaining / 2) : null,
                ).catch(this.error),
          'initialBatteryPercentageRemaining'
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
          'mountingModeActive',
            (result) => this.setCapabilityValue('mounting_mode_active', result.mountingModeActive).catch(this.error),
          'initialMountingModeActive'
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
          'openWindowDetection',
            (result) => this.setCapabilityValue('alarm_window_open', ['windowsOpen', 'externalOpen'].includes(result.openWindowDetection)).catch(this.error),
          'initialOpenWindowDetection'
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
          'externalOpenWindowDetection',
            (result) => this.setCapabilityValue('window_open_trigger', result.externalOpenWindowDetection).catch(this.error),
          'initialExternalOpenWindowDetection'
        );
    }

    async readSettings() {
        await this.readAttributeTimeout(
            CLUSTER.BASIC.NAME,
            'swBuildId',
            (result) => this.setSettings({ firmwareVersion: result.swBuildId }).catch(this.error),
            'readFirmware',
        );
        await this.readAttributeTimeout(
            PoppThermostatUICluster.NAME,
            'keypadLockout',
            (result) => this.setSettings({ lockControls: result.keypadLockout !== 0 }).catch(this.error),
            'readKeypadLockout',
        );
        await this.readAttributeTimeout(
            PoppThermostatUICluster.NAME,
            'viewingDirection',
            (result) => this.setSettings({ viewingDirection: result.viewingDirection }).catch(this.error),
            'readViewingDirection',
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
            'deviceOrientation',
            (result) => this.setSettings({ deviceOrientation: result.deviceOrientation ? 'vertical' : 'horizontal' }),
            'readDeviceOrientation',
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
            'mountingModeActive',
            (result) => this.setSettings({ mountingMode: result.mountingModeActive }).catch(this.error),
            'readMountingMode',
        );
        await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
            'windowOpenFeature',
            (result) => this.setSettings({ windowOpenEnabled: result.windowOpenFeature }).catch(this.error),
            'readWindowOpen',
        );  
		await this.readAttributeTimeout(
            PoppSpecificThermostatCluster.NAME,
            'regulationSetPointOffset',
            (result) => this.setSettings({setPointOffset: result.regulationSetPointOffset}).catch(this.error),
            'readSetPointOffset'
        )
	}

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log('Changed keys', changedKeys);
        this.log('New Settings', newSettings);
        this.log('Old Settings', oldSettings);

        changedKeys.forEach((key) => {
            switch (key) {
                case 'lockControls':
                    this.writeAttributeTimeout(
                        PoppThermostatUICluster.NAME,
                        'keypadLockout',
                        newSettings[key] ? 'level1Lockout' : 'noLockout',
                        'writeKeypadLockout',
                    );
                    break;
                case 'viewingDirection':
                    this.writeAttributeTimeout(
                        PoppThermostatUICluster.NAME,
                        'viewingDirection',
                        newSettings[key],
                        'writeViewingDirection',
                    );
                    break;
                case 'deviceOrientation':
                    this.writeAttributeTimeout(
                      PoppSpecificThermostatCluster.NAME,
                      'deviceOrientation',
                      newSettings[key] === 'vertical',
                        'writeDeviceOrientation'
                    );
                    break;
                case 'mountingMode':
                    this.writeAttributeTimeout(
                        PoppSpecificThermostatCluster.NAME,
                        'mountingModeControl',
                        newSettings[key],
                        'writeMountingMode',
                    );
                    break;
                case 'windowOpenEnabled':
                      let windowOpenEnabled = newSettings[key];
                      if (windowOpenEnabled) {
                        this.addCapabilityIfNotPresent('alarm_window_open', false).catch(this.error);
                        this.addCapabilityIfNotPresent('window_open_trigger', false).catch(this.error);
                    } else {
                        this.setCapabilityValue('alarm_window_open', false).catch(this.error);
                        this.deleteCapabilityIfPresent('alarm_window_open').catch(this.error);
                        this.deleteCapabilityIfPresent('window_open_trigger').catch(this.error);
                    }
					this.writeAttributeTimeout(
                        PoppSpecificThermostatCluster.NAME,
                        'windowOpenFeature',
                        windowOpenEnabled,
                        'writeWindowOpen',
                    );
                    break;
					case 'setPointOffset':
                    this.writeAttributeTimeout(
                        PoppSpecificThermostatCluster.NAME,
                        'regulationSetPointOffset',
                        newSettings[key],
                        'writeSetPointOffset',
                    );
                    break;
            }
        });
    }

    async writeAttributeTimeout(cluster, attribute, value, intervalName) {
        if (this.intervals[intervalName]) {
            this.homey.clearInterval(this.intervals[intervalName]);
            delete this.intervals[intervalName];
        }

        this.intervals[intervalName] = this.homey.setInterval(
              () => this.writeAttribute(cluster, attribute, value, intervalName).catch(this.error),
            60000,
        );
        await this.writeAttribute(cluster, attribute, value, intervalName);
    }

     async writeAttribute(cluster, attribute, value, intervalName) {
        await this.zclNode.endpoints[1].clusters[cluster]
            .writeAttributes({
                [attribute]: value,
            })
            .then((result) => {
                this.log('Write attribute', attribute, value, 'had result', result);
                this.homey.clearInterval(this.intervals[intervalName]);
                delete this.intervals[intervalName];
            })
            .catch(this.error);
    }

    async readAttributeTimeout(cluster, attribute, callback, intervalName) {
        if (this.intervals[intervalName]) {
            this.homey.clearInterval(this.intervals[intervalName]);
            delete this.intervals[intervalName];
        }

        this.intervals[intervalName] = this.homey.setInterval(
            () => this.readAttribute(cluster, attribute, callback, intervalName).catch(this.error),
            60000,
        );
        await this.readAttribute(cluster, attribute, callback, intervalName);
    }

    async readAttribute(cluster, attribute, callback, intervalName) {
        await this.zclNode.endpoints[1].clusters[cluster].readAttributes(attribute)
            .then((result) => {
                this.log('Read attribute', attribute, 'had result', result);
                callback(result);
                this.homey.clearInterval(this.intervals[intervalName]);
                delete this.intervals[intervalName];
            })
            .catch(this.error);
    }

   async addCapabilityIfNotPresent(capability, defaultValue) {
        if (this.hasCapability(capability)) {
            return;
        }

        await this.addCapability(capability);
        if (defaultValue !== undefined) {
            await this.setCapabilityValue(capability, defaultValue);
        }
    }

    async deleteCapabilityIfPresent(capability) {
        if (!this.hasCapability(capability)) {
            return;
        }
		await this.removeCapability(capability);
    }
}


module.exports = ThermostatDevice;
