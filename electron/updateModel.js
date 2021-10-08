const fs = require("fs");
const tempfs = require("temp")
const { modelLocation, modelVersionURL, modelZipURL } = require("../res/values");
const path = require("path");
const https = require("https");
const unzipper = require('unzipper');
const { getDeviceSerialNumber } = require("../utils/serial");
const { log, warn, verbose } = require("electron-log");
const { exec } = require('child_process');
const temp = require("temp");

temp.track();

const readLocalVersion = () => new Promise(resolve => {
    fs.readFile(path.resolve(modelLocation, "model-version"), (error, data) => {
        try {
            if (error) {
                resolve(0);
            } else {
                resolve(parseInt(data.toString()));
            }
        } catch (error) {
            warn("Failed read local version");
            resolve(0);
        }
    });
});

const readRemoteVersion = () => new Promise((resolve, reject) => {
    https.get(modelVersionURL, (response) => {
        response.setEncoding("utf8");
        let body = "";
        response.on("data", data => {
            body += data;
        });
        response.on("end", () => {
            try {
                body = JSON.parse(body);
                resolve(body["model-screening-version"]);
            } catch (error) {
                reject(error);
                console.error("Server replied incorrectly");
            }
        });
    }).on("error", (error) => {
        reject(error)
    });
});

const downloadRemoteZip = () => new Promise(async (resolve, reject) => {
    let serialNumber = await getDeviceSerialNumber();

    const fd = temp.openSync('model-update-inose');
    https.get(modelZipURL`${serialNumber}`, (response) => {
        try {
            response.on("data", data => {
                fs.writeSync(fd.fd, data);
            });
            response.on("end", () => {
                fs.closeSync(fd.fd)
                resolve(fd.path);
            });
            response.on("error", (err) => {
                fs.closeSync(fd.fd)
                reject(err);
            });
        } catch (error) {
            fs.closeSync(fd.fd)
            reject(error);
        }
    }).on("error", (error) => {
        reject(error)
    });
});

const updateModel = async () => {
    try {
        if (!fs.existsSync(modelLocation)) {
            fs.mkdirSync(modelLocation);
        }

        let modelVersion = await readLocalVersion();
        let remoteVersion = await readRemoteVersion();

        verbose("Checking model update...", modelVersion, remoteVersion)

        if (modelVersion < remoteVersion) {
            verbose("Terdeteksi model baru. Mendownload...");

            let zipPath = await downloadRemoteZip();
            verbose("Zip model downloaded in ", zipPath);
            await new Promise(a => {
                fs.createReadStream(zipPath)
                    .pipe(unzipper.Extract({ path: modelLocation }))
                    .on("close", a)
            })

            // instakasi library python
            try {
                verbose("Install Python Library");
                await new Promise((accept, reject) => {
                    const child = exec('pip3 install -r requirements.txt', {
                        cwd: modelLocation
                    }, (error) => {
                        if (error) {
                            reject(error);
                        }
                    });
                    child.stdout.on("data", (chunk) => {
                        verbose("PIP INSTALL: ", chunk.toString())
                    })
                    child.on("exit", () => {
                        accept();
                    });
                })
            } catch (error) {
                verbose("error instalasi python library");
                verbose("error =>", error);
            }

            verbose("Selesai update", modelLocation);
        }
    } catch (error) {
        console.error("Cannot update model", error);
    }
}

const startUpdateModelLoop = async () => {
    await updateModel();

    let updateModelFunction = async () => {
        await updateModel();
        setTimeout(updateModelFunction, 30000);
    }

    setTimeout(updateModelFunction, 30000);
}

module.exports = startUpdateModelLoop;