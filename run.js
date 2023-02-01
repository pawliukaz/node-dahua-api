require('dotenv').config();
let ipcamera = require('./dahua.js');
let log = false;
if (process.env.CAMERA_LOG==='true') {
    log = true;
}

// Options:
let options = {
    host	: process.env.CAMERA_HOST,
    port 	: process.env.CAMERA_PORT,
    user 	: process.env.CAMERA_USER,
    pass 	: process.env.CAMERA_PASS,
    log 	: log
};

let dahua = new ipcamera.dahua(options);
let time = new Date();
let crossLineAlarm = false;
const presetPositions = [1, 2, 3];
const mainPosition = 2;
let currentPosition = 2;

console.log('Running...');
console.log('Move back to 2 position...');
dahua.ptzPreset(mainPosition);

// Monitor Camera Alarms
dahua.on('alarm', function(code, action, index, eventData) {
    eventData = JSON.parse(eventData);
    if (code === 'CrossLineDetection' && action === 'Stop') {
        if (eventData.Name === 'Rule2') {
            console.log('Move to 2 position...');
            dahua.ptzPreset(2);
            crossLineAlarm = true;
        }
        if (eventData.Name === 'Rule4') {
            console.log('Move to 1 position...');
            dahua.ptzPreset(1);
            crossLineAlarm = true;
        }
        if (eventData.Name === 'Rule5') {
            console.log('Move to 3 position...');
            dahua.ptzPreset(3);
            crossLineAlarm = true;
        }
        if (eventData.Name === 'Rule7') {
            console.log('Move to 2 position...');
            dahua.ptzPreset(mainPosition);
            crossLineAlarm = true;
        }
    }
});

dahua.on('alarm', function (code, action, index, eventData) {
    eventData = JSON.parse(eventData);
    if (code === 'CrossRegionDetection' && action === 'Stop') {
        if (eventData.Name === 'Rule1') {
            console.log('Motion alert at 1 position');
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                crossLineAlarm = true;
                asyncCameraMove();

            }
        }
        if (eventData.Name === 'Rule3') {
            console.log('Motion alert at 2 position');
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                crossLineAlarm = true;
                asyncCameraMove();

            }
        }
        if (eventData.Name === 'Rule6') {
            console.log('Motion alert at 2 position');
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                crossLineAlarm = true;
                asyncCameraMove();

            }
        }
    }
});

setInterval(() => {
    if (!crossLineAlarm) {
        console.log('Camera moves to position ' + presetPositions[currentPosition] + ' ...');
        dahua.ptzPreset(presetPositions[currentPosition]);
        currentPosition++;

        if (currentPosition >= presetPositions.length) {
            currentPosition = 0;
        }
    }
}, 3 * 60 * 1000);


function resolveAfter300Seconds() {
    console.log('Start counting until move back...');
    return new Promise(resolve => {
        setTimeout(() => {
            crossLineAlarm = false;
            resolve(true);
        }, 300000);
    });
}

async function asyncCameraMove() {
    time = new Date();
    const result = await resolveAfter300Seconds()
    if (result === true) {
        console.log('Move back to 2 position...');
        dahua.ptzPreset(mainPosition);
    }
}




