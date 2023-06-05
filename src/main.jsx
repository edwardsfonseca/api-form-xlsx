import React from "react";

import "./index.css";

import Rout from "./routes";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(

    <React.StrictMode>
      <Rout />
    </React.StrictMode>

);
