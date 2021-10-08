import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { AppLayoutDefault } from "./layouts/AppLayoutDefault";
import { AppLayoutHome } from "./layouts/AppLayoutHome";
import Home from "./views/Home";
import Booting from "./views/Booting";
import Process from "./views/Process";
import Scan from "./views/Scan";
import Settings from "./views/Settings";

const App = () => (
    <MemoryRouter>
        <Switch>
            <Route
                path="/process"
                render={props => (
                    <AppLayoutDefault previousPath="/scan" hideBackButton>
                        <Process {...props} />
                    </AppLayoutDefault>
                )}
            />
            <Route
                path="/scan"
                render={props => (
                    <AppLayoutDefault previousPath="/home">
                        <Scan {...props} />
                    </AppLayoutDefault>
                )}
            />
            <Route
                path="/settings"
                render={props => (
                    <AppLayoutHome>
                        <Settings {...props} />
                    </AppLayoutHome>
                )}
            />
            <Route
                path="/home"
                render={props => (
                    <AppLayoutHome>
                        <Home {...props} />
                    </AppLayoutHome>
                )}
            />
            <Route path="/" render={props => <Booting {...props} />} />
        </Switch>
    </MemoryRouter>
);

export default App;
