'use strict';

const { ZCLDataTypes, ThermostatCluster} = require('zigbee-clusters');

class PoppSpecificThermostatCluster extends ThermostatCluster {

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      openWindowDetection: {
        id: 0x4000,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.enum8({
          quarantine: 0,
          windowsClosed: 1,
          hold: 2,
          windowsOpen: 2,
          externalOpen: 3,
        }),
      },
      externalOpenWindowDetection: {
        id: 0x4003,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.bool,
      },
      mountingModeActive: {
        id: 0x4012,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.bool,
      },
      mountingModeControl: {
        id: 0x4013,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.bool,
      },
	        deviceOrientation: {
        id: 0x4014,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.bool,
      },
	   regulationSetPointOffset: {
        id: 0x404B,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.int8,
      },
      windowOpenFeature: {
        id: 0x4051,
        manufacturerId: 0x1246,
        type: ZCLDataTypes.bool,
      },
    };
  }

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      setPoppSetpoint: {
        id: 0x40,
        manufacturerId: 0x1246,
        args: {
          setpointType: ZCLDataTypes.enum8({
            eco: 0,
            fast: 1,
            nonDisplay: 2,
          }),
          heatingSetpoint: ZCLDataTypes.int16,
        }
      }
    };
  }

}

module.exports = PoppSpecificThermostatCluster;
