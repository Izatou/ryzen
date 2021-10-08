import React from "react";

const ScanningStatus = ({ percentString }) => (
    <>
        <div className="w-1/5 flex items-center justify-center">
            <p className="text-2xl font-semibold text-green-500">{percentString}</p>
        </div>
        <div className="flex-1 pr-5">
            <p className="text-xl mb-3 leading-none font-semibold text-brand-green">Pengambilan data</p>
            <div className="relative h-2 bg-gray-200 w-full rounded-full overflow-hidden">
                <div
                    className="absolute top-0 bg-green-500 h-2"
                    style={{ width: percentString }}
                ></div>
            </div>
        </div>
    </>
)

export default ScanningStatus;