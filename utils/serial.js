const { exec } = require("child_process");

exports.getDeviceSerialNumber = () =>
    new Promise((accept, reject) => {
        exec("inose-serial", (error, data) => {
            if (error) {
                reject(error);
            } else {
                accept(data);
            }
        });
    });
