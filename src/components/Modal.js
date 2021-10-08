import React from "react";

export const Modal = ({ isOpened, onDismiss, children }) => (
    <div
        className={
            "fixed inset-0 flex flex-col items-center justify-center z-20" +
            (!isOpened ? " pointer-events-none" : "")
        }>
        <div
            className={
                isOpened
                    ? "transition duration-300 ease-out opacity-100"
                    : "transition duration-200 ease-in opacity-0"
            }>
            <div
                onClick={onDismiss}
                className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        <div
            className={
                (isOpened
                    ? "transition duration-300 ease-out opacity-100 transform translate-y-0"
                    : "transition duration-200 ease-in opacity-0 transform translate-y-6") +
                " relative w-4/5"
            }>
            {children}
        </div>
    </div>
);
