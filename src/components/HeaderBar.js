import React from "react";
import { ReactComponent as LogoInose } from "../assets/logo-full.svg";

export const HeaderBar = ({ className }) => (
    <div className={"flex items-center justify-between py-6 " + className}>
        <h1 className="text-4xl font-semibold text-brand-green">Pengaturan</h1>
        <div className="w-16">
            <LogoInose className="w-full" />
        </div>
    </div>
);
