import React from "react";
import { HeaderBar } from "../../components/HeaderBar";
import ChangeProcessSettings from "./ChangeProcessSettings";
import SyncDataSetting from "./SyncDataSetting";

const Settings = () => (
    <div className="flex-1 flex flex-col">
        <div className="flex-1 w-full px-8">
            <HeaderBar className="mb-12" />

            <div className="bg-white rounded-lg p-5 space-y-7 shadow-lg">
                <ChangeProcessSettings />
            </div>

            <div className="bg-white mt-5 rounded-lg p-5 space-y-7 shadow-lg">
                <SyncDataSetting />
            </div>
        </div>

        <div className="text-center text-gray-400 leading-tight py-5">
            i-nose c-19 Version {window.bridge.appVersion}
        </div>
    </div>
)

export default Settings;