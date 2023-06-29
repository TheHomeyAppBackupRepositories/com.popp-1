'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class P700052 extends ZwaveDevice {

  onNodeInit() {
    this.registerCapability('alarm_water', 'SENSOR_BINARY');
    
    this.registerCapability('measure_battery', 'BATTERY');
  }

}

module.exports = P700052;
