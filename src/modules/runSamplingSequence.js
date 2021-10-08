import calculateSensorAnova from "./calculateSensorAnova";
import checkSensorRange from "./checkSensorRange";

const { DATA_NUM } = window.bridge.values;

const runPompa = toggle => {
    window.ipc.send("toggle-pompa", toggle);
};

export const CovidStatusId = {
    NegatifCovid19: 1,
    NegatifInfeksiParuParu: 2,
    PositifTanpaGejala: 3,
    PositifRingan: 4,
    PositifSedangAtauModerat: 5,
    PositifBeratAtauPneumoniaBerat: 6,
    PositifKritis: 7,
    Unknown: 8,
    PositifGeneral: 9,
};

/**
 * @typedef {{
 * result: 0|1;
 * accuracy: number;
 * covid_status_id: number;
 * data1: Float32Array;
 * data2: Float32Array;
 * data3: Float32Array;
 * }} PredictionResult
 * @param {number} process1
 * @param {number} process2
 * @param {number} process3
 * @param {(percent: string, capturedData: Float32Array, secondElapsed: number) => void} onDataUpdate
 * @param {() => void} onPredicting
 * @param {(type: "anova" | "sensor100" | "dataKurang" | "dataInvalid") => void} onFailed
 * @param {(milisecond: number) => void} onHalfProcess
 * @param {(cancelRun: () => void) => void} stopCallback
 * @param {(milisecond: number) => void} onFlushing
 * @return {Promise<PredictionResult>}
 */
const runSamplingSequence = (
    process1,
    process2,
    process3,
    onHalfProcess,
    onDataUpdate,
    onPredicting,
    stopCallback,
    onFailed,
    onFlushing,
) =>
    new Promise(done => {
        // Toleransi 10s
        let data1 = new Float32Array(DATA_NUM * (process1 + 10));
        let data2 = new Float32Array(DATA_NUM * (process2 + 10));
        let data3 = new Float32Array(DATA_NUM * (process3 + 10));

        let ts1 = new Float32Array(process1 + 10);
        let ts2 = new Float32Array(process2 + 10);
        let ts3 = new Float32Array(process3 + 10);

        let index1 = 0;
        let index2 = 0;
        let index3 = 0;

        let process = 1;

        let cleanup = () => {
            data1 = data2 = data3 = null;
            ts1 = ts2 = ts3 = null;
        };

        let cancelRun = () => {
            stopListening();
            runPompa(true);
            clearTimeout(to1);
            clearTimeout(to2);
            clearTimeout(to3);

            cleanup();
        };

        let triggerUpdate = () => {
            let data, ts;
            if (process === 1) {
                data = data1.subarray(
                    (index1 - 1) * DATA_NUM,
                    index1 * DATA_NUM,
                );
                ts = ts1[index1 - 1];
            } else if (process === 2) {
                data = data2.subarray(
                    (index2 - 1) * DATA_NUM,
                    index2 * DATA_NUM,
                );
                ts = ts2[index2 - 1];
            } else if (process === 3) {
                data = data3.subarray(
                    (index3 - 1) * DATA_NUM,
                    index3 * DATA_NUM,
                );
                ts = ts3[index3 - 1];
            }

            onDataUpdate(
                Math.round(
                    ((performance.now() - startPerformanceNow) /
                        1000 /
                        (process1 + process2 + process3)) *
                        100,
                ) + "%",
                data,
                Math.floor((ts - startPerformanceNow) / 1000),
            );
        };

        let onSensorData = (event, incomingData) => {
            let floatArray = new Float32Array(incomingData.buffer).subarray(
                0,
                DATA_NUM,
            );
            let index;
            let nowTick = performance.now();
            switch (process) {
                case 1:
                    index = index1++;
                    ts1[index] = nowTick;
                    // if (!checkSensorRange(floatArray)) {
                    //     cancelRun();
                    //     onFailed && onFailed("sensor100");
                    // }
                    data1.set(floatArray, index * DATA_NUM);
                    break;
                case 2:
                    index = index2++;
                    ts2[index] = nowTick;
                    data2.set(floatArray, index * DATA_NUM);

                    if (index2 >= 10 + index1 && (index2 - 10) % index1 === 0) {
                        let anovaSelangDetection = window.bridge.config.read(
                            "anovaSelangDetection",
                        );

                        if (anovaSelangDetection) {
                            // Hitung anova
                            let anovaAccepted = calculateSensorAnova(
                                data1.subarray(0, index1 * DATA_NUM),
                                data2.subarray(
                                    (index2 - index1) * DATA_NUM,
                                    index2 * DATA_NUM,
                                ),
                                DATA_NUM,
                            );

                            window.log.verbose(index2, index1, index2 - index1);

                            if (!anovaAccepted) {
                                window.log.warn(
                                    "Anova gagal. Membatalkan pengambilan sampling.",
                                );
                                cancelRun();
                                onFailed && onFailed("anova");
                            }
                        }
                    }
                    break;
                case 3:
                    index = index3++;
                    ts3[index] = nowTick;
                    data3.set(floatArray, index * DATA_NUM);
                    break;
                default:
            }

            triggerUpdate();
        };

        let to1 = setTimeout(() => {
            window.log.verbose("Masuk ke P2");
            onHalfProcess &&
                onHalfProcess(performance.now() - startPerformanceNow);
            process = 2;
            runPompa(false);
        }, process1 * 1000);

        let to2 = setTimeout(() => {
            window.log.verbose("Masuk ke P3");
            onFlushing && onFlushing(performance.now() - startPerformanceNow);
            process = 3;
            runPompa(true);
        }, (process1 + process2) * 1000);

        let to3 = setTimeout(() => {
            window.log.verbose("P3 selesai.");
            stopListening();
            onPredicting();
            window.model
                .predict(
                    data1.subarray(0, index1 * DATA_NUM),
                    data2.subarray(0, index2 * DATA_NUM),
                    data3.subarray(0, index3 * DATA_NUM),
                    DATA_NUM,
                )
                .then(hasilPredict => {
                    if (hasilPredict[0] < 0.5 && !window.bridge.config.read(
                        "ignoreInvalid",
                    )) {
                        throw "data-invalid"
                    }else{
                        let thresholdPositive = window.bridge.config.read(
                            "thresholdPositive",
                        );

                        done({
                            accuracy: hasilPredict[1],
                            covid_status_id: hasilPredict[1] >= thresholdPositive ? 4 : 1, //positif : negatif
                            result: hasilPredict[1] >= thresholdPositive ? 1 : 0, //positif : negatif
                            data1: data1.subarray(0, index1 * DATA_NUM),
                            data2: data2.subarray(0, index2 * DATA_NUM),
                            data3: data3.subarray(0, index3 * DATA_NUM),
                        });
                    }
                })
                .catch(error => {
                    cancelRun();
                    window.log.warn("Predict gagal:", error);
                    if (error === "data-lack") {
                        onFailed && onFailed("dataKurang");
                    } else if (error === "data-invalid") {
                        onFailed && onFailed("dataInvalid");
                    }
                })
                .finally(() => {
                    cleanup();
                });
        }, (process1 + process2 + process3) * 1000);

        runPompa(true);
        stopCallback && stopCallback(cancelRun);

        let startTime = new Date();
        let startPerformanceNow = performance.now();
        let stopListening = window.ipc.on("sensor-data", onSensorData);
    });

export default runSamplingSequence;
