import React from "react";
import { ReactComponent as LogoLoading } from "../assets/logo-loading.svg";
import { ReactComponent as LogoTick } from "../assets/check.svg";
import { ReactComponent as LogoFailed } from "../assets/cancel.svg";

const LoadingStatus = ({ text, isDone, children }) => {
    return (
        <div className="flex mb-5">
            {isDone === true ? (
                <LogoTick className="mr-4 w-6" />
            ) : isDone === false ? (
                <LogoFailed className="mr-4 w-6 h-6" />
            ) : (
                <LogoLoading className="mr-4 animate-spin w-6 h-6" />
            )}
            <div className="flex-1 flex flex-col">
                <div>{text}</div>
                {children}
            </div>
        </div>
    );
};

export default LoadingStatus;
