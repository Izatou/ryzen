import React from "react";
import Positive from "../assets/img-positive-covid19.png";

export const ModalPositive = ({ className }) => (
    <div className={className}>
        <img src={Positive} className="w-3/5 mx-auto opacity-75 mb-6" />
        <div className="text-center">
            <p className="text-red-500 text-4xl font-semibold">
                {window.bridge.config.read("positiveResult")}
            </p>
            {window.bridge.config.read("screeningMode") == 0
                ? ""
                : "Data berhasil disimpan"}
        </div>
    </div>
);
