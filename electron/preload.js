const { ipcRenderer, contextBridge, remote } = require("electron");
const { readConfig, writeConfig } = require("../utils/config");
const values = require("../res/values");
const { EventEmitter } = require("events");
const {
    existsSync,
    mkdir,
    writeFile,
    readdir,
    readFile,
    rename,
} = require("fs");
const { resolve } = require("path");
const { getDeviceSerialNumber } = require("../utils/serial");
const log = require("electron-log");
const ipcPromise = require("electron-promise-ipc");
const bridgeEvent = new EventEmitter();
const inose = require('./lib/inose');

ipcRenderer.on("sensor-data", (e, d) => {
    bridgeEvent.emit("sensor-data", d);
});

contextBridge.exposeInMainWorld("log", log);

contextBridge.exposeInMainWorld("ipc", {
    on: (channel, fn) => {
        ipcRenderer.addListener(channel, fn);
        return () => {
            ipcRenderer.removeListener(channel, fn);
        };
    },
    send: (channel, ...args) => {
        ipcRenderer.send(channel, ...args);
    },
});

contextBridge.exposeInMainWorld("_boot", {
    startPython: () => {
        return ipcRenderer.invoke("start-python");
    },
    startPythonPredict: () => {
        return ipcPromise.send("start-python-predict");
    },
    startKTP: () => {
        return ipcRenderer.invoke("start-ktp");
    },
    checkSensorType: () => {
        return ipcPromise.send("check-sensor-type");
    },
});

contextBridge.exposeInMainWorld("fs", {
    writeFile: (path, data) =>
        new Promise((resolve, reject) => {
            writeFile(path, data, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }),
    existsSync: path => existsSync(path),
    mkdir: path =>
        new Promise((resolve, reject) => {
            mkdir(path, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }),
    readdir: path =>
        new Promise((resolve, reject) => {
            readdir(path, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        }),
    readFile: path =>
        new Promise((resolve, reject) => {
            readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }),
    rename: (pathFrom, pathTo) =>
        new Promise((resolve, reject) => {
            rename(pathFrom, pathTo, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }),
});

contextBridge.exposeInMainWorld("dialog", {
    showMessage: (title, message) => {
        ipcRenderer.send("show-message", title, message);
    },
});

contextBridge.exposeInMainWorld("bridge", {
    appVersion: ipcRenderer.sendSync("system", "appVersion"),
    getDeviceSerialNumber,
    values,
    ipcRenderer,
    config: {
        read: readConfig,
        write: writeConfig,
    },
    writeModel: async content => {
        log.verbose(
            "Menulis CSV untuk diprediksi model ke " + values.modelLocation,
        );
        let file = resolve(values.modelLocation, "input_predict.csv");
        if (!existsSync(values.modelLocation)) {
            await new Promise(r => mkdir(values.modelLocation, r));
        }
        await new Promise(r => writeFile(file, content, r));
    },
});

contextBridge.exposeInMainWorld("model", {
    predict: (p1, p2, p3, DATA_NUM) =>
        new Promise((accept, reject) => {
            ipcRenderer.once("predict-data-reply", (event, hasilPredict) => {
                accept(hasilPredict);
            });
            ipcRenderer.once("predict-data-failed", (event, msg) => {
                reject("data-invalid");
            });

            const p1_filtered = Float32Array.from(
                p1.filter((v, i) => {
                    return i % DATA_NUM < 8;
                }),
            );

            const p2_filtered = Float32Array.from(
                p2.filter((v, i) => {
                    return i % DATA_NUM < 8;
                }),
            );

            const p3_filtered = Float32Array.from(
                p3.filter((v, i) => {
                    return i % DATA_NUM < 8;
                }),
            );

            if (p2_filtered.length / 8 < 45) {
                reject("data-lack");
                return;
            }

            ipcRenderer.send(
                "predict-data",
                p1_filtered,
                p2_filtered,
                p3_filtered,
                8,
            );
        }),

    save: (
        nik,
        device_id,
        covid_status,
        sampling_id,
        created_at,
        accuracy,
        sensor_type,
        data1,
        data2,
        data3,
        outputFile,
    ) => {
        inose.write(
            nik,
            device_id,
            covid_status,
            sampling_id,
            created_at,
            accuracy,
            sensor_type,
            data1,
            data2,
            data3,
            outputFile,
        )
    },
});
