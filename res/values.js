const { ipcRenderer, app } = require("electron");
const path = require("path");

const appDataPath = app
    ? app.getPath("appData")
    : ipcRenderer.sendSync("system", "appDataPath");
const documentPath = app
    ? app.getPath("documents")
    : ipcRenderer.sendSync("system", "documentsPath");

exports.modelLocation = path.join(appDataPath, ".enose-model");
exports.modelVersionURL = "https://inose.id:5555/api/update/modelVersion";
exports.modelZipURL = (s, serial) =>
    `https://inose.id:5555/api/update/downloadModel?serial_number=${serial}`;
exports.screeningAPIURL = "https://inose.id:5555/api";

exports.pythonSensorStreamingFile = "enosika-new";
exports.pythonRunPompaFile = "runPompa";
exports.predictPythonFile = "main.py";
exports.pythonSensorType = "sensorType";

// Dummy for testing
// exports.screeningAPIURL = "http://localhost:8000/api";
// exports.pythonSensorStreamingFile = "dummy";
// exports.pythonRunPompaFile = "runPompaDummy";
// exports.pythonSensorType = "sensorTypeDummy";

exports.csvHeader =
    "Timestamp;PROCESS;MQ2_ADC;MQ3_ADC;MQ4_ADC;TGS2610_ADC;TGS2600_ADC;TGS822_ADC;MQ137_ADC;MQ138_ADC;MQ135_ADC;TEMPERATURE;HUMIDITY\n";
exports.csvNASensorIndex = [8];
exports.anovaNASensorIndex = [8, 9, 10];
exports.DATA_NUM = 11;

exports.sensorDataSaveLocation = path.join(documentPath, "backup-sensordata");
