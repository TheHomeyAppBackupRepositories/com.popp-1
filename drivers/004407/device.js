'use strict';


const { ZwaveDevice } = require('homey-zwavedriver');

const TEST_TIMEOUT = 30 * 1000;

class P004407 extends ZwaveDevice {
	
	onNodeInit() {
	
    	this.enableDebug();
		this.printNode();
		this.registerCapability('alarm_co', 'NOTIFICATION');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		
		this.registerReportListener('alarm_co', 'NOTIFICATION', report => {
      if (report && report['Notification Type'] === 'CO'
				&& report.hasOwnProperty('Event (Parsed)')
				&& report['Event (Parsed)'].includes('Test')
      ) {
        if (this.testTimeout) clearTimeout(this.testTimeout);
        this.testTimeout = setTimeout(() => {
          this.setCapabilityValue('alarm_co', false).catch(this.error);
        }, TEST_TIMEOUT);
      }
    });
	
		this.registerCapability('measure_battery', 'BATTERY');
	}
}
module.exports = P004407;
