'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P700168 extends ZwaveDevice {
onNodeInit() {
  	    this.enableDebug();
		this.printNode();
		
		//this._isHeavyRainCondition = this.driver.isHeavyRainCondition;
		//this._isRainingCondition = this.driver.isRainingCondition;
		
		this._rainOnTrigger = this.driver.rainOnTrigger;
		this._rainOffTrigger = this.driver.rainOffTrigger;
		this._heavyRainAlarmOnTrigger = this.driver.heavyRainAlarmOnTrigger;
		this._heavyRainAlarmOffTrigger = this.driver.heavyRainAlarmOffTrigger;
		
    
	this.registerCapability('is_rain', 'BASIC', {
	get: 'BASIC_GET',
	report: 'BASIC_SET',
	reportParser: report => {
		if (report && report.hasOwnProperty('Value') && this.getSetting('2') === report['Value'])
		{
		this._rainOnTrigger.trigger(this, null, null).catch(this.error);
		return true;
			}
		else if (report && report.hasOwnProperty('Value') && this.getSetting('3') === report['Value'])
		{ 
		this._rainOffTrigger.trigger(this, null, null).catch(this.error);
		return false;
		}
		return null;
	},
	});
    this.registerCapability('alarm_heavyrain', 'BASIC', {
	get: 'BASIC_GET',
	report: 'BASIC_SET',
	reportParser: report => {
		if (report && report.hasOwnProperty('Value') && this.getSetting('6') === report['Value'])
		{
		this._heavyRainAlarmOnTrigger.trigger(this, null, null).catch(this.error);
		return true;
		}
		else if (report && report.hasOwnProperty('Value') && this.getSetting('7') === report['Value'])
		{ 
		this._heavyRainAlarmOffTrigger.trigger(this, null, null).catch(this.error);
		return false;
		}
		else if (report && report.hasOwnProperty('Value') && this.getSetting('3') === report['Value'])
		{ 
		this._heavyRainAlarmOffTrigger.trigger(this, null, null).catch(this.error);
		return false;
		}
		return null;
	},
	});
	
	
    this.registerCapability('meter_rain', 'METER', {
        get: 'METER_REPORT',
        getParser: () => ({
          Properties1: {
            Scale: 0,
            'Rate Type:': 'Import'
          },
        }),
        report: 'METER_REPORT',
        reportParser: report => {
          if (report &&
			report.hasOwnProperty('Properties1') &&
			report.Properties1.hasOwnProperty('Meter Type') &&
			report.Properties1['Meter Type'] === 'Water meter' &&
			report.Properties1.hasOwnProperty('Scale bit 2') &&
			report.Properties1['Scale bit 2'] === false &&
			report.hasOwnProperty('Properties2') &&
			report.Properties2.hasOwnProperty('Scale bits 10') &&
			report.Properties2['Scale bits 10'] === 0) {
           return report['Meter Value (Parsed)'];
          }
          return null;
        }
      },
	);
	    this.registerCapability('measure_rain.total', 'SENSOR_MULTILEVEL', {
        get: 'SENSOR_MULTILEVEL_REPORT',
        getParser: () => ({
          'Sensor Type': 'Rain rate (version 2)',
          Properties1: {
            Scale: 0,
            'Rate Type:': 'Import'
          },
        }),
        report: 'SENSOR_MULTILEVEL_REPORT',
        reportParser: report => {
		if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'General purpose value (version 1)') {
           return report['Sensor Value (Parsed)'];
          }
          return null;
        },
      });
	
    this.registerCapability('measure_rain', 'SENSOR_MULTILEVEL', {
        get: 'SENSOR_MULTILEVEL_REPORT',
        getParser: () => ({
          'Sensor Type': 'Rain rate (version 2)',
          Properties1: {
            Scale: 0,
            'Rate Type:': 'Import'
          },
        }),
        report: 'SENSOR_MULTILEVEL_REPORT',
        reportParser: report => {
          if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Value (Parsed)'] != "14" && (report['Sensor Type'] === 'Rain rate (version 2)' || report['Sensor Type'] === 'Rain rate (version 2) ')) {
           return report['Sensor Value (Parsed)'];
          }
          return null;
        },
      });
    this.registerCapability('measure_battery', 'BATTERY');
	
	this.homey.flow.getConditionCard('is_raining')
      .registerRunListener((args, state) => {
        const rainInfo = args.device.getCapabilityValue('is_rain');
        return Promise.resolve(rainInfo);
      });

    this.homey.flow.getConditionCard('is_heavyrain')
      .registerRunListener((args, state) => {
        const heavyRainInfo = args.device.getCapabilityValue('alarm_heavyrain');
        return Promise.resolve(heavyRainInfo);
      });
	
	
    }
  }
  module.exports = P700168;