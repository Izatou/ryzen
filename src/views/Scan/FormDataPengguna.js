import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as LogoCard } from "../../assets/logo-card.svg";
import { ReactComponent as LogoLoading } from "../../assets/logo-loading.svg";
import { ReactComponent as LogoPhone } from "../../assets/logo-phone.svg";
import { ReactComponent as LogoUser } from "../../assets/logo-user.svg";
import { Keyboard } from "../../components/Keyboard";
import { useVariable } from "../../utils/hooks";

const FormDataPengguna = ({ setAllowDismissModal, isOpened }, ref) => {

    const history = useHistory();

    const setAllowDismissModalTimer = useRef();

    /**
     * @type {React.MutableRefObject<import("../../components/Keyboard").KeyboardType>}
     */
    const keyboardRef = useRef();
    const [serial, setSerial] = useState(null);
    const [nik, setNIK, showNIKKeyboard] = useVariable("", keyboardRef, "number", 16);
    const [nama, setNama, showNamaKeyboard] = useVariable("", keyboardRef, "shift");
    const [noWA, setNoWA, showNoWAKeyboard] = useVariable("", keyboardRef, "number");
    
    const [deodorant, setDeodorant] = useState(0); // -1: Kurang dari 1 jam, 0: Tidak Ada, 1: Lebih dari 1 jam
    const [isNIKChecked, setNIKChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useImperativeHandle(ref, () => ({
        setKTPInput: (serial, ktp) => {
            setSerial(serial);
            setNIK(ktp);
            setNIKChecked(false);
            onCekNIKPress(ktp);
        }
    }), []);

    const onSubmitPatientAndStartSamplingPress = async () => {
        setIsSubmitting(true);

        let data = {
            serial_ktp: serial,
            nik: nik,
            name: nama,
            phone: noWA
        };

        if ( (!nik || !nama) || (!noWA && window.bridge.config.read('kirimWaTextShow')) ) {
            setErrorMessage("Mohon untuk mengisi nama dan nik pasien terlebih dahulu.");
        } else {
            try {
                let resp = await fetch(window.bridge.values.screeningAPIURL + "/register", {
                    body: JSON.stringify(data),
                    headers: {
                        'content-type': "application/json"
                    },
                    method: "POST"
                });

                if (resp.ok) {
                    let { status, message, data } = await resp.json();
                    if (status === "failed") {
                        setErrorMessage(message);
                    } else {
                        history.push("/process", {...data, deodorant});
                    }
                } else {
                    setErrorMessage("Tidak dapat menghubungi server inose-c19. Silahkan coba beberapa saat lagi.");
                }
            } catch (error) {
                // TODO: Ganti showMessage
                window.dialog.showMessage("Mode Offline", "Anda sedang offline. Pengujian akan dilakukan secara offline.");
                history.push("/process", {...data, deodorant});
            }
        }

        setIsSubmitting(false);
    };

    const onCekNIKPress = async (forceNIK) => {
        setIsSubmitting(true);

        const goOffline = () => {
            window.log.verbose("Cannot connect to server (Offline)")
            setNIKChecked(true);
            setNama("");
            setNoWA("");
            setErrorMessage("Anda sedang berada di dalam mode offline. Silahkan isi data diri pasien secara manual.");
        };

        try {
            let resp = await fetch(window.bridge.values.screeningAPIURL + "/findUser", {
                method: "POST",
                body: JSON.stringify({
                    nik: forceNIK || nik
                }),
                headers: {
                    "content-type": "application/json"
                }
            });

            if (resp.ok && resp.headers.get('content-type') === 'application/json') {
                try {
                    const { name, phone } = await resp.json();
                    if (!name) {
                        setNama("");
                        setNoWA("");
                        setErrorMessage("Data NIK belum terdaftar. Silahkan isi data diri pasien.");
                    } else {
                        setNama(name || "");
                        setNoWA(phone || "");
                    }
                } catch (error) {
                    setNama("");
                    setNoWA("");
                    setErrorMessage("Data NIK belum terdaftar. Silahkan isi data diri pasien.");
                }

                setNIKChecked(true);
            } else {
                goOffline();
            }
        } catch (error) {
            goOffline();
        }

        setIsSubmitting(false);
    };

    useLayoutEffect(() => {
        if (!isOpened) {
            setNIKChecked(false);
            setIsSubmitting(false);
            setErrorMessage("");
        }
    }, [isOpened]);

    return (
        <>
            <div className="w-full bg-white rounded-xl px-4 pt-5 pb-8 space-y-3 -mt-56">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-brand-green">Data Pengguna</h2>
                    <p className="text-xl text-semibold opacity-70 text-gray-500">
                        Silahkan lengkapi data dan mulai test
                    </p>

                    {errorMessage &&
                        <div className="bg-red-600 mt-5 px-3 py-2 rounded-lg">
                            <p className="text-lg text-semibold text-white text-center">
                                {errorMessage}
                            </p>
                        </div>
                    }
                </div>

                {/* NIK */}
                <div>
                    <span className="block text-left mb-2 font-semibold text-gray-500">Nomor Induk Kependudukan (NIK)</span>
                    <div className="relative">
                        <input
                            value={nik}
                            onInput={(e) => setNIK(e.target.value)}
                            onFocus={showNIKKeyboard}
                            maxLength={16}
                            type="text"
                            placeholder="NIK"
                            className="w-full outline-none tracking-wide text-xl text-gray-700 font-semibold placeholder-gray-300 pl-16 pr-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-green-lighter rounded-lg transition duration-300"
                        />
                        <div className="absolute inset-y-0 top-0 flex items-center">
                            <LogoCard className="w-8 h-8 ml-3 text-gray-400" />
                        </div>
                    </div>
                </div>

                {isNIKChecked && <>
                    {/* Nama Pengguna  */}
                    <div>
                        <span className="block text-left mb-2 font-semibold text-gray-500">Nama</span>
                        <div className="relative">
                            <input
                                value={nama}
                                onInput={(e) => setNama(e.target.value)}
                                onFocus={showNamaKeyboard}
                                maxLength={255}
                                type="text"
                                placeholder="Nama"
                                className="w-full outline-none tracking-wide text-xl text-gray-700 font-semibold placeholder-gray-300 pl-16 pr-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-green-lighter rounded-lg transition duration-300"
                            />
                            <div className="absolute inset-y-0 top-0 flex items-center">
                                <LogoUser className="w-8 h-8 ml-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Nomor WA Pengguna --> */}
                    <div className={ window.bridge.config.read('kirimWaTextShow') ? "" : "hidden"}>
                        <span className="block text-left mb-2 font-semibold text-gray-500">Nomor (Whatsapp)</span>
                        <div className="relative">
                            <input
                                value={noWA}
                                onInput={(e) => setNoWA(e.target.value)}
                                onFocus={showNoWAKeyboard}
                                maxLength={255}
                                type="text"
                                placeholder="Nomor WA"
                                className="w-full outline-none tracking-wide text-xl text-gray-700 font-semibold placeholder-gray-300 pl-16 pr-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-green-lighter rounded-lg transition duration-300"
                            />
                            <div className="absolute inset-y-0 top-0 flex items-center">
                                <LogoPhone className="w-8 h-8 ml-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Deodorant */}
                    <div className="grid grid-cols-2 py-4">
                        <div>
                            <div className="font-semibold text-gray-700 text-xl">Deodorant</div>
                            <div className="text-gray-400 text-sm">*Opsional</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={()=>setDeodorant(b=> b < 0 ? 0 : -1)} className={"flex items-center justify-center tracking-wide p-1 rounded-lg w-full shadow-lg focus:outline-none border" + (deodorant < 0 ? " bg-brand-green text-white" : "")}>
                                {"<= 1 jam"}
                            </button>
                            <button onClick={()=>setDeodorant(b=> b > 0 ? 0 : 1)} className={"flex items-center justify-center tracking-wide p-1 rounded-lg w-full shadow-lg focus:outline-none border" + (deodorant > 0 ? " bg-brand-green text-white" : "")}>
                                {"> 1 jam"}
                            </button>
                        </div>
                    </div>
                </>}

                {/* <!-- Simpan data pasien --> */}
                <div className="pt-5">
                    <button
                        onClick={isNIKChecked ? onSubmitPatientAndStartSamplingPress : (() => onCekNIKPress())}
                        className="flex items-center justify-center tracking-wide font-semibold p-3 rounded-lg text-white text-xl w-full bg-brand-green shadow-lg focus:outline-none transition duration-200 transform hover:-translate-y-1"
                    >
                        <LogoLoading className={(isSubmitting ? "block animate-spin" : "hidden") + " -ml-1 mr-3 h-6 w-6 text-white"} />
                        {isNIKChecked ? "Simpan dan mulai test" : "Cek NIK"}
                    </button>
                </div>
            </div>

            <Keyboard
                ref={keyboardRef}
                onShow={() => {
                    clearTimeout(setAllowDismissModalTimer.current);
                    setAllowDismissModal(false);
                }}
                onHide={() => {
                    setAllowDismissModalTimer.current = setTimeout(() => setAllowDismissModal(true), 500);
                }}
            />
        </>
    )
}

export default forwardRef(FormDataPengguna);
