import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ReactComponent as LogoInose } from "../assets/logo-full.svg";
import LoadingStatus from "../components/LoadingStatus";
import ProgressBar from "../components/ProgressBar";
import waitUntilSensorStable from "../modules/waitUntilSensorStable";

const Booting = () => {
    const [depsChecked, setDeps] = useState(null);
    const [predChecked, setPreds] = useState(null);
    const [ktpChecked, setKTP] = useState(null);
    const [serialChecked, setSerial] = useState(null);
    const [envChecked, setEnv] = useState(null);
    const [currentTempAndHumidity, setCurrentTempAndHumidity] = useState("");

    const history = useHistory();

    useEffect(() => {
        if (
            depsChecked &&
            predChecked &&
            ktpChecked &&
            serialChecked &&
            envChecked
        ) {
            history.push("/home");
        }
    }, [depsChecked, ktpChecked, serialChecked, envChecked, predChecked]);

    useEffect(() => {
        window._boot
            .startPython()
            .then(() => {
                setDeps(true);
                // jalankan startenv try catch
                waitUntilSensorStable(({ humidity, temperature }) => {
                    setCurrentTempAndHumidity(
                        `${temperature.toFixed(1)}°C / ${humidity.toFixed(
                            1,
                        )}% RH`,
                    );
                }).then(() => {
                    setEnv(true);
                });
            })
            .catch(() => {
                setDeps(false);
                setEnv(false);
            });

        window._boot
            .startPythonPredict()
            .then(() => {
                setPreds(true);
            })
            .catch((a) => {
                window.log.verbose(a)
                setPreds(false);
            });

        window._boot
            .startKTP()
            .then(() => {
                setKTP(true);
            })
            .catch(() => {
                setKTP(false);
            });

        window.bridge
            .getDeviceSerialNumber()
            .then(() => {
                setSerial(true);
            })
            .catch(() => {
                setSerial(false);
            });
    }, []);

    return (
        <div className="flex flex-col h-full items-center justify-center">
            <div className="flex-col flex items-center">
                <LogoInose className="w-32" />
                <div className="mt-16">
                    <LoadingStatus
                        isDone={depsChecked}
                        text="Starting the services.."
                    />
                    <LoadingStatus
                        isDone={predChecked}
                        text="Starting the model.."
                    />
                    <LoadingStatus
                        isDone={serialChecked}
                        text="Checking serial number..."
                    />
                    <LoadingStatus
                        isDone={ktpChecked}
                        text="Checking KTP Scanner..."
                    />
                    <LoadingStatus
                        isDone={envChecked}
                        text="Warming-up sensor chamber...">
                        <ProgressBar
                            className="mt-2"
                            percentString="100%"
                            remainingText={currentTempAndHumidity}
                        />
                    </LoadingStatus>
                </div>
                {/* Contoh komponen */}
                {/* https://www.flaticon.com/free-icon/check_463574?term=check&page=1&position=21&page=1&position=21&related_id=463574&origin=search */}
            </div>
        </div>
    );
};

export default Booting;
