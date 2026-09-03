import React from "react";
import ReactDOM from "react-dom/client";
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme.css";
import "./overrides.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
