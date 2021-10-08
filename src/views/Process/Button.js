import React from "react";

export const Button = ({ logo, text, onClick, color, disabled }) => (
    <button
        onClick={disabled ? undefined : onClick}
        className={color + " tracking-wide font-semibold relative p-3 rounded-lg text-white text-xl w-full shadow-lg focus:outline-none transition duration-300" + (disabled ? " disabled" : "")}
    >
        <span>{text}</span>
        <div className="flex items-center absolute inset-y-0 right-0 pr-2">
            {logo}
        </div>
    </button>
);
