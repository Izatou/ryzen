import React from "react";
import { TopBar } from "../components/TopBar";

export const AppLayoutDefault = ({
    children,
    previousPath,
    hideBackButton,
}) => (
    <div className="min-h-screen flex flex-col px-8 py-6">
        <TopBar previousPath={previousPath} hideBackButton={hideBackButton} />
        {children}
    </div>
);
