import React from "react";
import Negative from "../assets/img-negative-covid19.png";

export const ModalNegative = ({ className }) => (
    <div className={className}>
        <img src={Negative} className="w-3/5 mx-auto opacity-75 mb-6" />
        <div className="text-center">
            <p className="text-green-500 text-4xl font-semibold">
                {window.bridge.config.read("negativeResult")}
            </p>
            {window.bridge.config.read("screeningMode") == 0
                ? ""
                : "Data berhasil disimpan"}
        </div>
    </div>
);
