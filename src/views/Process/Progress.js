import React, { useState } from "react";
import { ReactComponent as LogoNegative } from "../../assets/logo-negative.svg";
import { ReactComponent as LogoSecure } from "../../assets/logo-secure.svg";
import { ReactComponent as LogoTimer } from "../../assets/logo-timer.svg";
import { ProgressButton } from "./ProgressButton";
import ScanningStatus from "./ScanningStatus";

const Progress = ({
    onStartTestPress,
    onStopTestPress,
    onKembaliPress,
    percentString,
    isResultNegativeCovid,
    processSequence,
    isStopBtnShow
}) => {

    const [isDetailOpen, setIsDetailOpen] = useState(false)

    return (
        <div className="absolute bottom-0 w-full space-y-5 pb-10">
            <div className="bg-white rounded-lg shadow-lg divide-y overflow-hidden">

                <div className={isDetailOpen ? "space-y-6 py-7" : "py-7"}>

                    {/* Preparation status */}
                    {processSequence >= 0 &&
                        <div className={processSequence === 0 || isDetailOpen ? "flex" : "hidden"}>
                            <div className="w-1/5 flex items-center justify-center">
                                <LogoSecure className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="flex-1 pr-5">
                                <p className="text-xl leading-none font-semibold text-brand-green">Persiapan</p>
                                <p className="text-gray-400 text-lg">Pengguna memasukkan selang kedalam ketiak</p>
                            </div>
                        </div>
                    }

                    {/* Scanning Status */}
                    {processSequence >= 1 &&
                        <div className={processSequence === 1 || isDetailOpen ? "flex" : "hidden"}>
                            <ScanningStatus
                                percentString={percentString}
                            />
                        </div>
                    }

                    {/* Analysing Status */}
                    {processSequence >= 2 &&
                        <div className={processSequence === 2 || isDetailOpen ? "flex" : "hidden"}>
                            <div className="w-1/5 flex items-center justify-center">
                                <LogoTimer className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="flex-1 pr-5">
                                <p className="text-xl leading-none font-semibold text-brand-green">
                                    {window.bridge.config.read('screeningMode') == 0 ? 'Analisa data' : 'Penyimpanan data'}
                                </p>
                                <p className="text-gray-400 text-lg">Mohon menunggu</p>
                            </div>
                        </div>
                    }

                    {/* Prediction Status */}
                    {processSequence >= 3 &&
                        <div className={processSequence === 3 || isDetailOpen ? "flex" : "hidden"}>
                            <div className="w-1/5 flex items-center justify-center">
                                <LogoNegative
                                    // className={"w-12 h-12 " + (isResultNegativeCovid ? "text-green-500" : "text-red-500")}
                                    className={"w-12 h-12 " + (isResultNegativeCovid ? "text-green-500" : "text-green-500")}
                                />
                            </div>
                            <div className="flex-1 pr-5">
                                <p className="text-lg leading-none text-gray-400 mb-3">Hasil</p>
                                {/* <span className={"font-semibold text-xl px-3 py-2 rounded-lg -mx-3 " + (isResultNegativeCovid ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50")}>
                                    {isResultNegativeCovid ? "Negative Covid-19" : "Positif Covid-19"}
                                </span> */}
                                {/* <span className={"font-semibold text-xl px-3 py-2 rounded-lg -mx-3 " + (isResultNegativeCovid ? "text-green-500 bg-green-50" : "text-green-500 bg-green-50")}>
                                    {isResultNegativeCovid ? "Negative Covid-19" : "Negative Covid-19*"}
                                </span> */}
                                <span className={"font-semibold text-xl px-3 py-2 rounded-lg -mx-3 " + (isResultNegativeCovid ? "text-green-500 bg-green-50" : "text-green-500 bg-green-50")}>
                                    {isResultNegativeCovid ? window.bridge.config.read('negativeResult') : window.bridge.config.read('positiveResult')}
                                </span>
                            </div>
                        </div>
                    }

                </div>

                <div onClick={() => setIsDetailOpen(b => !b)} className="flex items-center justify-center text-xl text-gray-400 py-4 cursor-pointer">
                    <span>{isDetailOpen ? "Tutup Detail" : "Buka Detail"}</span>
                    <svg
                        className={isDetailOpen ? "transform rotate-180 w-6 h-6 ml-3 transition duration-300" : "w-6 h-6 ml-3 transition duration-300"}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                </div>

            </div>

            <ProgressButton
                processSequence={processSequence}
                onKembaliPress={onKembaliPress}
                onStartTestPress={onStartTestPress}
                onStopTestPress={onStopTestPress}
                isStopBtnShow={isStopBtnShow}
            />
        </div>
    )
}

export default Progress;