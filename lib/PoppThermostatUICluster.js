'use strict';

const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

const ATTRIBUTES = {
    temperatureDisplayMode: {
        id: 0x0,
        type: ZCLDataTypes.enum8({
            celcius: 0,
            fahrenheit: 1,
        }),
    },
    keypadLockout: {
        id: 0x1,
        type: ZCLDataTypes.enum8({
            noLockout: 0,
            level1Lockout: 1,
            level2Lockout: 2,
            level3Lockout: 3,
            level4Lockout: 4,
            level5Lockout: 5,
        }),
    },
    viewingDirection: {
        id: 0x4000,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.enum8({
            direction1: 0,
            direction2: 1,
        }),
    },
};

const COMMANDS = {};

class PoppThermostatUICluster extends Cluster {
    static get ID() {
        return 0x0204;
    }

    static get NAME() {
        return 'thermostatUI';
    }

    static get ATTRIBUTES() {
        return ATTRIBUTES;
    }

    static get COMMANDS() {
        return COMMANDS;
    }
}

Cluster.addCluster(PoppThermostatUICluster);

module.exports = PoppThermostatUICluster;
