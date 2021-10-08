import { randomStr } from "../utils/str";
import { default as setupSamplingSaveDirectory } from "./setupSamplingSaveDirectory";


const saveInose = async (nik, predictionResult, deodorant) => {
    let [backupDir] = await setupSamplingSaveDirectory();
    let filename = `${randomStr(10)}.inoseimage`;

    let id = 0,
        offline = false;
    const device_id = await window.bridge.getDeviceSerialNumber();
    try {
        let response = await fetch(
            window.bridge.values.screeningAPIURL + "/sampling",
            {
                method: "POST",
                body: JSON.stringify({
                    nik,
                    covid_status_id: predictionResult.covid_status_id,
                    accuracy: predictionResult.accuracy,
                    deodorant,
                    serial_number: device_id,
                }),
                headers: { "content-type": "application/json" },
            },
        );

        if (
            response.ok &&
            response.headers.get("content-type") == "application/json"
        ) {
            let json = await response.json();
            id = json.id || 0;
        } else {
            offline = true;
        }
    } catch (e) {
        if (e instanceof TypeError) {
            offline = true;
        }
    } finally {
        window.model.save(
            nik,
            device_id,
            predictionResult.covid_status_id,
            id || 0,
            Math.floor(Date.now()/1000),
            predictionResult.accuracy,
            await window._boot.checkSensorType(),
            predictionResult.data1,
            predictionResult.data2,
            predictionResult.data3,
            backupDir + "/" + filename,
        );
    }

    return { offline };
};

export default saveInose;
