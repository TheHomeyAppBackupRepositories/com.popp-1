'use strict';

//const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P005206 extends ZwaveDevice {
  onNodeInit() {
	  	this.enableDebug();
		this.printNode();
		this._dewPointTrigger = this.driver.dewPointTrigger;
        this.registerCapability('measure_wind_strength', 'SENSOR_MULTILEVEL', {
                get: 'SENSOR_MULTILEVEL_GET',
                getParser: () => ({
                  'Sensor Type': 'Velocity (version 2)',
                  Properties1: {
                    Scale: 0,
                  },
                }),
                report: 'SENSOR_MULTILEVEL_REPORT',
                reportParser: report => {
                  if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'Velocity (version 2)' || report['Sensor Type'] === 'Velocity (version 2) ') {
                    return report['Sensor Value (Parsed)']*3.6; //from m/s to km/h
                  }
                  return null;
                }
              });
			
			
      this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
      this.registerCapability('measure_pressure', 'SENSOR_MULTILEVEL', {
              get: 'SENSOR_MULTILEVEL_GET',
              getParser: () => ({
                'Sensor Type': 'Barometric pressure (version 2)',
                Properties1: {
                  Scale: 0,
                },
              }),
              report: 'SENSOR_MULTILEVEL_REPORT',
              reportParser: report => {
                if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'Barometric pressure (version 2)' || report['Sensor Type'] === 'Barometric pressure (version 2) ') {
                  if (this.getSetting('metres_over_sea_level') >= 1)
				  {
				  return Math.round(report['Sensor Value (Parsed)']*10/Math.pow(1-(0.0065*this.getSetting('metres_over_sea_level'))/288.15, 5.255)) //simplified Barometric formula
				  }
				  else
				  {
				  return report['Sensor Value (Parsed)']*10;
				  }
                }
                return null;
              }
            });
      this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL', {
                get: 'SENSOR_MULTILEVEL_GET',
                getParser: () => ({
                  'Sensor Type': 'Dew point (version 2)',
                  Properties1: {
                    Scale: 0,
                  },
                }),
                report: 'SENSOR_MULTILEVEL_REPORT',
                reportParser: report => {
                  if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'Dew point (version 2)' || report['Sensor Type'] === 'Dew point (version 2) ') {
					    const token = {
				dewpoint: report['Sensor Value (Parsed)'],
              };
			   this._dewPointTrigger.trigger(this, token, this.device_data).catch(this.error);
                    return report['Sensor Value (Parsed)'];
                  }
                  return null;
                }
              });
			  
	  this.registerCapability('meter_power.solar', 'METER', {
				get: 'METER_GET',
				report: 'METER_REPORT',
				reportParser: report => {
					if (report.hasOwnProperty('Properties1')
						&& report.Properties1.hasOwnProperty('Meter Type')
						&& report.Properties1['Meter Type'] === 1
						&& report.hasOwnProperty('Properties2')
						&& report.Properties2.hasOwnProperty('Scale bits 10')
						&& report.Properties2['Scale bits 10'] === 0) {
							return report['Meter Value (Parsed)'];
						}
					return null;
				}
});
	  
      this.registerCapability('measure_battery', 'BATTERY');
  }
  resetMeterRunListener(args, state) {
    if (this.node && this.node.CommandClass.COMMAND_CLASS_METER) 
			{
				this.log('Action card METER_RESET triggered');
				this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}).catch(this.error);
				
			} else return false;
	};
 // resetMeterRunListener(args, state) {
//		if (this.node &&
 //       this.node.CommandClass &&
 //           this.node.CommandClass.COMMAND_CLASS_METER) {
//		this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}, (err, result) => {
//
				// If properly transmitted, change the setting and finish flow card
//				return result === 'TRANSMIT_COMPLETE_OK';
//			});
//		} else return false;
//	}
}
module.exports = P005206;
