import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoInose } from "../assets/logo-full.svg";

export const TopBar = ({ previousPath, hideBackButton }) => (
    <div className="relative flex items-center justify-between">
        <div className="z-10">
            {!hideBackButton && (
                <Link to={previousPath}>
                    <button className="flex items-center bg-white text-gray-500 pl-2 pr-4 py-2 rounded-full tracking-wide font-semibold shadow-lg focus:outline-none">
                        <svg
                            className="w-4 h-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali
                    </button>
                </Link>
            )}
        </div>
        <div className="z-10">
            <LogoInose className="w-16 h-auto" />
            <img src={LogoInose} className="w-16 h-auto" alt="" />
        </div>
        <div className="absolute w-full z-0">
            <p className="text-center text-xl font-semibold text-brand-green"></p>
        </div>
    </div>
);
