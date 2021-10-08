import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Preparation from "../../assets/preparation.png";
import LineChart from "../../components/LineChart";
import { Modal } from "../../components/Modal";
import { ModalNegative } from "../../components/ModalNegative";
import { ModalPositive } from "../../components/ModalPositive";
import runSamplingSequence from "../../modules/runSamplingSequence";
import saveInose from "../../modules/saveInose";
import Progress from "./Progress";

const Process = () => {
    const history = useHistory();
    const {
        name,
        nik,
        phone,
        deodorant,
        // birth,
        // gender,
        // serial_ktp,
    } = history.location.state;
    const butuhKirimWA = window.bridge.config.read("kirimWaTextShow");

    useLayoutEffect(() => {
        if (!history.location.state) {
            history.push("/scan");
        }
    }, []);

    // 0: Masukkan selang
    // 1: Sampling
    // 2: Predict
    // 3: Finish
    const [processSequence, setProcessSequence] = useState(0);
    const [samplingPercentString, setSamplingPercentString] = useState("0%");
    const [predictionResult, setPredictionResult] = useState();
    const [isPredictionModalOpen, setPredictionModalOpen] = useState(false);
    const [isStopBtnShow, setStopBtnShow] = useState(false);
    const lineChartRef = useRef();
    const cancelRunSamplingSequence = useRef();

    // Hasil Pengujian
    const isOffline = useRef(true);

    const restartSamplingProcess = () => {
        setProcessSequence(0);
        setStopBtnShow(false);
        setSamplingPercentString("0%");
        isOffline.current = true;
    };

    const onStartTestPress = async () => {
        setProcessSequence(1);
        window.log.verbose("Mulai ambil data");

        setStopBtnShow(false);

        let predictionResult = await runSamplingSequence(
            window.bridge.config.read("process1"),
            window.bridge.config.read("process2"),
            window.bridge.config.read("process3"),
            milisecond => {
                lineChartRef.current.setP2In(milisecond);
                setStopBtnShow(true);
            },
            (percent, capturedData, secondElapsed) => {
                setSamplingPercentString(percent);
                lineChartRef.current &&
                    lineChartRef.current.pushData(capturedData, secondElapsed);
            },
            () => setProcessSequence(2),
            cancelRun => (cancelRunSamplingSequence.current = cancelRun),
            type => {
                if (type == "anova") {
                    restartSamplingProcess();
                    window.dialog.showMessage(
                        "Selang Lepas",
                        "Kami mendeteksi bahwa selang terlepas/kurang rapat. Silahkan perbaiki posisi selang terlebih dahulu.",
                    );
                }
                if (type == "sensor100") {
                    restartSamplingProcess();
                    window.dialog.showMessage(
                        "Sensor Rusak",
                        "Silahkan menghubungi tim inose untuk perbaikan sensor.",
                    );
                }
                if (type == "dataKurang") {
                    window.dialog.showMessage(
                        "Data Kurang",
                        "Waktu pengambilan di P2 minimal 45 detik. Silahkan masuk ke settings dan ubah waktu untuk P2.",
                    );
                    cancelRunSamplingSequence.current &&
                        cancelRunSamplingSequence.current();
                    history.push("/settings");
                }
                if (type == "dataInvalid") {
                    restartSamplingProcess();
                    window.dialog.showMessage(
                        "Data Invalid",
                        "Saat proses pengambilan mungkin pasien mengempit selang terlalu kuat atau sensor butuh maintenance. Silahkan coba sekali lagi, jika tetap tidak bisa silahkan hubungi INOSE Official",
                    );
                }
            },
            milisecond => {
                lineChartRef.current.setP2Out(milisecond);
            },
        );
        window.log.verbose("Selesai ambil data");
        setProcessSequence(3);
        setSamplingPercentString("100%");

        const statusSave = await saveInose(nik, predictionResult, deodorant);
        isOffline.current = statusSave.offline;
        setPredictionResult(predictionResult);
        setPredictionModalOpen(true);
    };

    const onStopTestPress = useRef(() => {
        // TODO: Mas Adhe, tambah modal buat nanyain apakah mau berhenti? wkwk
        cancelRunSamplingSequence.current();
        history.push("/scan");
    }).current;

    return (
        <div className="relative flex-1">
            <div className="rounded-xl">
                {/* Process sampling started, showed the charts */}
                {processSequence >= 1 && (
                    <div className="mt-12 rounded-lg">
                        <LineChart height={450} ref={lineChartRef} />
                    </div>
                )}

                {/* If has not been started */}
                {processSequence === 0 && (
                    <div className="mt-16">
                        <img
                            src={Preparation}
                            className="w-72 h-72 mx-auto mb-4"
                            alt=""
                        />
                        <p className="text-center text-xl text-gray-400 px-16">
                            Hi {name},<br />
                            Siapkan selang dan pastikan telah terpasang di
                            ketiak pasien
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Progress */}
            <Progress
                onStartTestPress={onStartTestPress}
                onKembaliPress={() => history.push("/scan")}
                onStopTestPress={onStopTestPress}
                isResultNegativeCovid={
                    (predictionResult && predictionResult.result) === 0
                }
                processSequence={processSequence}
                percentString={samplingPercentString}
                isStopBtnShow={isStopBtnShow}
            />

            <Modal isOpened={isPredictionModalOpen}>
                <div className="bg-white w-2/3 mx-auto rounded-xl p-3">
                    {predictionResult && predictionResult.result ? (
                        <ModalPositive className="mt-8 mb-3" />
                    ) : (
                        <ModalNegative className="mt-8 mb-3" />
                    )}
                    {butuhKirimWA && (
                        <div className="relative mb-5">
                            {isOffline.current && (
                                <div className="bg-red-600 mt-5 px-3 py-2 rounded-lg">
                                    <p className="text-lg text-semibold text-white text-center">
                                        Data Offline
                                    </p>
                                </div>
                            )}
                            <div className="col-span-2 pt-6 space-y-1 lg:space-y-2">
                                <div className="grid grid-cols-3">
                                    <div className="text-sm lg:text-lg text-gray-400">
                                        NIK
                                    </div>
                                    <div className="lg:text-xl col-span-2 text-gray-700 font-semibold">
                                        {nik}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3">
                                    <div className="text-sm lg:text-lg text-gray-400">
                                        Nama
                                    </div>
                                    <div className="lg:text-xl col-span-2 text-gray-700 font-semibold">
                                        {name}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3">
                                    <div className="text-sm lg:text-lg text-gray-400">
                                        Expired At
                                    </div>
                                    <div className="lg:text-xl col-span-2 text-gray-700 font-semibold">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => history.push("/scan")}
                        className="focus:outline-none block w-full mb-2 bg-brand-green text-white rounded-lg font-semibold tracking-wide text-lg py-3">
                        {" "}
                        Ambil data baru{" "}
                    </button>
                    <button
                        onClick={() => setPredictionModalOpen(false)}
                        className="focus:outline-none block w-full text-gray-400 text-lg py-1">
                        Kembali
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Process;
