'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class P700045 extends ZwaveDevice {
  onMeshInit() {
	    //this.enableDebug();
		//this.printNode();
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('alarm_battery', 'BATTERY');

    // define and register FlowCardTriggers
    let triggerUser = this.homey.flow.getDeviceTriggerCard('user_validated');
    triggerUser
      .register()
      .registerRunListener((args, state) => {
        //this.log(args, state);
        return Promise.resolve(args.button === state.button || (args.button == 0 && state.button >= 1 && state.button <= 20) /* && args.scene === state.scene */ );
      })
	  
	let triggerUserID = this.homey.flow.getDeviceTriggerCard('userid_validated');
    triggerUserID
      .register()

    let triggerRing = this.homey.flow.getDeviceTriggerCard('ring_button');
    triggerRing
      .register()
      .registerRunListener((args, state) => {
        return Promise.resolve(args.button === state.button  || (args.button == 0));
      })

    let triggerInvalid = this.homey.flow.getDeviceTriggerCard('code_invalid');
    triggerInvalid
      .register()
      .registerRunListener((args, state) => {
        return Promise.resolve(state.button === '23' );
      })

    // register a report listener
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (rawReport, parsedReport) => {
      if (rawReport.hasOwnProperty('Properties1') &&
        rawReport.Properties1.hasOwnProperty('Key Attributes') &&
        rawReport.hasOwnProperty('Scene Number') &&
        rawReport.hasOwnProperty('Sequence Number')) {
        if (typeof PreviousSequenceNo === "undefined") { var PreviousSequenceNo = 0; }
        if (rawReport['Sequence Number'] !== PreviousSequenceNo) {
          const remoteValue = {
            button: rawReport['Scene Number'].toString(),
            scene: rawReport.Properties1['Key Attributes'],
          };
          PreviousSequenceNo = rawReport['Sequence Number'];
          // Trigger the trigger card with 2 dropdown options
          if(remoteValue.button == 21 || remoteValue.button == 22) { // bell-button: 21=once; 22=twice
            triggerRing
              .trigger(this, triggerRing.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          } else if(remoteValue.button == 23) { // unrecognized user code
            triggerInvalid
              .trigger(this, triggerInvalid.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          } else if(remoteValue.button <= 20 && remoteValue.button >= 1) { // user code 1-20
		   const token = {
				button: rawReport['Scene Number'] };
			   triggerUserID
              .trigger(this, token, this.device_data)
              .catch( err => { this.log('ReportListener', err) } );
            triggerUser
              .trigger(this, triggerUser.getArgumentValues, remoteValue)
              .catch( err => { this.log('ReportListener', err) } );
          }
        }
      }
    });
  }
}
module.exports = P700045;
