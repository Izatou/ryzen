const { sensorDataSaveLocation } = window.bridge.values;

const setupSamplingSaveDirectory = async () => {
    if (!window.fs.existsSync(sensorDataSaveLocation)) {
        try {
            await window.fs.mkdir(sensorDataSaveLocation);
        } catch {}

        try {
            await window.fs.mkdir(sensorDataSaveLocation + "/backup-csv");
        } catch {}

        try {
            await window.fs.mkdir(sensorDataSaveLocation + "/upload-csv");
        } catch {}
    }

    return [
        sensorDataSaveLocation + "/backup-csv",
        sensorDataSaveLocation + "/upload-csv",
    ];
};

export default setupSamplingSaveDirectory;
