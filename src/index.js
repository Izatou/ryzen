import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppLayout } from "./layouts/AppLayout";

import "./styles/index.css";
import "./styles/main.css"; // From tailwind
import "simple-keyboard/build/css/index.css";

window.log.silly("React succesfully loaded");

ReactDOM.render(
    <React.StrictMode>
        <AppLayout>
            <App />
        </AppLayout>
    </React.StrictMode>,
    document.getElementById("root"),
);
