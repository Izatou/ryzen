import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as LogoHome } from "../assets/logo-home.svg";
import { ReactComponent as LogoSettings } from "../assets/logo-settings.svg";

export const TabBar = () => (
    <nav className="bg-white w-full grid grid-cols-2 text-center border-t">
        <NavLink
            to="/home"
            exact
            activeClassName="text-brand-green"
            className="text-gray-400">
            <div className="py-2 opacity-80">
                <div className="w-8 -mb-1 mx-auto">
                    <LogoHome className="w-full h-full mx-auto" />
                </div>
                <span className="text-sm font-semibold">Home</span>
            </div>
        </NavLink>

        <NavLink
            to="/settings"
            activeClassName="text-brand-green"
            className="text-gray-400">
            <div className="py-2 opacity-80">
                <div className="w-8 -mb-1 mx-auto">
                    <LogoSettings className="w-full h-full mx-auto" />
                </div>
                <span className="text-sm font-semibold">Settings</span>
            </div>
        </NavLink>
    </nav>
);
