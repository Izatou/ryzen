import React, { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/Modal";
import FormDataPengguna from "./FormDataPengguna";
import KTPAnimated from "./KTPAnimated";

const Scan = () => {

    const [isModalShown, setModalShown] = useState(false);
    const [allowDismissModal, setAllowDismissModal] = useState(true);

    const formDataRef = useRef();

    useEffect(() => {
        if (!isModalShown) {
            const removeListener = window.ipc.on("ktp-detected", (event, data) => {
                setModalShown(true);
                window.log.verbose("KTP detected.");
                formDataRef.current.setKTPInput(data.serial, data.ktp);
            });

            return removeListener;
        }
    }, [isModalShown]);

    return (
        <>
            <div className="relative flex-1 flex items-center">
                <div className="w-full">

                    <div className="relative mb-6">
                        <div className="w-56 h-56 rounded-full bg-white opacity-70 mx-auto"></div>
                        <div className="absolute top-0 inset-y-0 flex items-center justify-center w-full">
                            <KTPAnimated />
                        </div>
                    </div>

                    {window.bridge.config.read("nfcKTPTextShow") &&
                        <>
                            <div className="text-center mb-3">
                                <h2 className="text-3xl font-semibold text-brand-green mb-2">Scan E-KTP</h2>
                                <p className="text-xl text-brand-green opacity-70">
                                    Tempelkan E-KTP di atas kanan i-nose (tertera label NFC) untuk menyimpan ID pengguna
                                </p>
                            </div>
                            <br />
                            <br />
                        </>
                    }

                    <div>
                        {window.bridge.config.read("nfcKTPTextShow") &&
                            <p className="text-xl mb-3 text-center text-brand-green opacity-70">
                                    atau masukkan data secara manual
                            </p>
                        }

                        <button
                            className="flex items-center font-semibold tracking-wide justify-center p-3 rounded-lg text-white text-xl w-full bg-brand-green shadow-lg focus:outline-none transition duration-200 transform hover:-translate-y-1"
                            onClick={() => setModalShown(true)}
                        >
                            <svg
                                className="w-6 h-6 text-white mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>

                        Masukkan data pengguna
                    </button>
                    </div>
                </div>
            </div>
            <Modal isOpened={isModalShown} onDismiss={allowDismissModal ? () => setModalShown(false) : undefined}>
                <FormDataPengguna isOpened={isModalShown} ref={formDataRef} setAllowDismissModal={setAllowDismissModal} />
            </Modal>
        </>
    )
}

export default Scan;