import React, { useRef, useState } from "react";
import { ReactComponent as LogoLoading } from "../../assets/logo-loading.svg";
import syncData from "../../modules/syncData";

export default () => {
    const [isUploading, setIsUploading] = useState(false);

    const onSyncPress = useRef(async () => {
        setIsUploading(true)
        try {
            await syncData();
        } catch (error) {
            window.dialog.showMessage("Unexpected Error", error);
        }
        setIsUploading(false)
    }).current;

    return (
        <div>
            <button
                onClick={onSyncPress}
                className="flex items-center font-semibold tracking-wide justify-center p-3 rounded-lg text-white text-xl w-full bg-brand-green shadow-lg focus:outline-none transition duration-200 transform hover:-translate-y-1"
            >
                <LogoLoading className={(isUploading ? "block animate-spin" : "hidden") + " -ml-1 mr-3 h-6 w-6 text-white"} />
                Sinkronisasi Database
            </button>
        </div>
    )
}