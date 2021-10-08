import React from "react";
import { Button } from "./Button";

export const ProgressButton = ({
    processSequence,
    onStopTestPress,
    onKembaliPress,
    onStartTestPress,
    isStopBtnShow
}) => {
    switch (processSequence) {
        case 3:
            return (
                <Button
                    color="bg-green-500"
                    text="Kembali"
                    logo={
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    }
                    onClick={onKembaliPress}
                />
            );
        case 2:
            return (
                <button className="bg-gray-400 tracking-wide font-semibold relative p-3 rounded-lg text-white text-xl w-full shadow-lg focus:outline-none transition duration-300" disabled>
                    <span>Mohon menunggu</span>
                </button>
            );
        case 1:
            return isStopBtnShow && (
                <Button
                    color="bg-red-500"
                    text="Berhenti"
                    logo={
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    }
                    onClick={onStopTestPress}
                />
            );
        case 0:
            return (
                <Button
                    color="bg-green-500"
                    text="Mulai test"
                    logo={
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    }
                    onClick={onStartTestPress}
                />
            );
        default:
            return <></>;
    }
}
