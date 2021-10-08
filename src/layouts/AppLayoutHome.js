import React from "react";
import { TabBar } from "../components/TabBar";

export const AppLayoutHome = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        {children}
        <TabBar />
    </div>
);
