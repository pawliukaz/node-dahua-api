var ipcamer = require('./dahua.js');
// Options:
var options = {
    host	: process.env.CAMERA_HOST,
    port 	: '80',
    user 	: 'admin',
    pass 	: '63u235pau',
    log 	: false
};

let dahua = new ipcamera.dahua(options);
let time = new Date();

console.log('Running...');
console.log('Move back to 2 position...');
dahua.ptzPreset(2);

// Monitor Camera Alarms
dahua.on('alarm', function(code,action,index, eventData) {
    eventData = JSON.parse(eventData);
    if (code === 'CrossLineDetection' && action === 'Stop') {
        if (eventData.Name === 'Rule2') {
            console.log('Move to 2 position...');
            dahua.ptzPreset(2);
        }
        if (eventData.Name === 'Rule4') {
            console.log('Move to 1 position...');
            dahua.ptzPreset(1);
        }
        if (eventData.Name === 'Rule5') {
            console.log('Move to 3 position...');
            dahua.ptzPreset(3);
        }
        if (eventData.Name === 'Rule7') {
            console.log('Move to 2 position...');
            dahua.ptzPreset(2);
        }
    }
});

dahua.on('alarm', function (code, action, index, eventData) {
    eventData = JSON.parse(eventData);
    if (code === 'CrossRegionDetection' && action === 'Stop') {
        if (eventData.Name === 'Rule1') {
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                asyncCameraMove();
            }
        }
        if (eventData.Name === 'Rule3') {
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                asyncCameraMove();
            }
        }
        if (eventData.Name === 'Rule6') {
            if (time.getTime() < ((new Date()).getTime()  - 300000)) {
                asyncCameraMove();
            }
        }
    }
});


function resolveAfter300Seconds() {
    console.log('Start counting until move back...');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 300000);
    });
}

async function asyncCameraMove() {
    time = new Date();
    const result = await resolveAfter300Seconds()
    if (result === true) {
        console.log('Move back to 2 position...');
        dahua.ptzPreset(2);
    }
}




