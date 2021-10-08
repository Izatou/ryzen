import React from "react";

const ProgressBar = ({ percentString, className, remainingText }) => (
    <div className={"flex-1 pr-5 " + className}>
        {/* <div className="relative h-2 bg-gray-200 w-full rounded-full overflow-hidden">
            <div
                className="absolute top-0 bg-green-500 h-2"
                style={{ width: percentString }}></div>
        </div> */}
        <div className="text-sm text-gray-500">{remainingText}</div>
    </div>
);

export default ProgressBar;
