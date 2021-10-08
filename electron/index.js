const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");
const {
    pythonSensorStreamingFile,
    pythonRunPompaFile,
} = require("../res/values");
const { startKTPPolling } = require("./startKTPPolling");
const { startPython, startPredictModelPython, checkSensorType } = require("./startPython");
const startUpdateModelLoop = require("./updateModel");
const log = require("electron-log");
const ipcPromise = require("electron-promise-ipc");

// Fetch update every 30s
startUpdateModelLoop();

/**
 * @type {BrowserWindow}
 */
let mainWindow;

function createWindow() {
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.resolve(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true,
        });

    mainWindow = new BrowserWindow({
        width: 600,
        height: 1024,
        resizable: true,
        // show: false,
        webPreferences: {
            // nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null); // Hide menu

    mainWindow.on("closed", () => {
        app.quit();
        mainWindow = null;
    });

    mainWindow.webContents.on("did-finish-load", () => {
        // mainWindow.setFullScreen(true)
        log.silly("Application loaded successfully");
        mainWindow.show();
        mainWindow.webContents.zoomFactor = 1;
    });

    // Load system
    mainWindow.loadURL(startUrl);
}

ipcMain.on("system", (event, cmd) => {
    switch (cmd) {
        case "appDataPath":
            event.returnValue = app.getPath("appData");
            break;
        case "documentsPath":
            event.returnValue = app.getPath("documents");
            break;
        case "appVersion":
            event.returnValue = app.getVersion();
            break;
    }
});

ipcMain.on("show-message", (event, title, message) => {
    dialog.showMessageBoxSync(mainWindow, {
        type: "info",
        title,
        message,
    });
});

process.on("uncaughtException", function (error) {
    // Handle the error
    log.error("Main process error:", error.message);
});

ipcMain.handle("start-python", async () => {
    // Start all python needs to be started
    return startPython([
        {
            name: pythonSensorStreamingFile,
            callback: child => {
                child.stdout.on("data", chunk => {
                    mainWindow &&
                        mainWindow.webContents.send("sensor-data", chunk);
                });
            },
        },
        {
            name: pythonRunPompaFile,
            callback: child => {
                ipcMain.on("toggle-pompa", (event, toggle) => {
                    child.stdin.write(String(toggle ? 1 : 0));
                });
            },
        },
    ]);
});

ipcPromise.on("check-sensor-type", () => {
   return checkSensorType();
});

ipcPromise.on("start-python-predict", () => {
    return startPredictModelPython(child => {
        // p1, p2, p3 expect Float32Array
        ipcMain.on("predict-data", (event, p1, p2, p3, DATA_NUM) => {
            log.verbose(
                "[predict-data] starting",
                p1.length / DATA_NUM,
                p2.length / DATA_NUM,
                p3.length / DATA_NUM,
            );

            const onError = chunk => {
                const msg = chunk.toString();
                if (msg.startsWith("IERR:")) {
                    // Terjadi kegagalan.
                    log.verbose("[predict-data][error] hasilPredict", msg);
                    child.stderr.off("data", onError);
                    event.reply("predict-data-failed", msg);
                }
            };
            child.stderr.on("data", onError);

            child.stdout.once("data", chunk => {
                child.stderr.off("data", onError);
                let hasilPredict = new Float32Array(chunk.buffer);
                event.reply("predict-data-reply", hasilPredict);
                log.verbose("[predict-data][once] hasilPredict", hasilPredict);
            });

            const buffer = Buffer.alloc(1 + 6);
            buffer.writeUInt8(1);
            buffer.writeUInt16LE(p1.length / DATA_NUM, 1 + 0 * 2);
            buffer.writeUInt16LE(p2.length / DATA_NUM, 1 + 1 * 2);
            buffer.writeUInt16LE(p3.length / DATA_NUM, 1 + 2 * 2);
            child.stdin.write(buffer);

            child.stdin.write(Buffer.from(Uint16Array.from(p1).buffer));
            child.stdin.write(Buffer.from(Uint16Array.from(p2).buffer));
            child.stdin.write(Buffer.from(Uint16Array.from(p3).buffer));
        });
    });
});

ipcMain.handle("start-ktp", async () => {
    return startKTPPolling(data => {
        mainWindow && mainWindow.webContents.send("ktp-detected", data);
    });
});

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});

// Auto Update
let doNotUpdate = false;
let updateApp = () => {
    try {
        if (!doNotUpdate) autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
        log.warn("APP UPDATE ERROR", error);
    }
};

setInterval(updateApp, 30000);
updateApp();

ipcMain.on("turn-off-update", () => {
    doNotUpdate = true;
});

ipcMain.on("turn-on-update", () => {
    doNotUpdate = false;
});

autoUpdater.on("update-available", () => {
    doNotUpdate = true;
    mainWindow && mainWindow.webContents.send("update-available");
});

autoUpdater.on("download-progress", data => {
    mainWindow && mainWindow.webContents.send("update-download-progress", data);
});

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall();
});
