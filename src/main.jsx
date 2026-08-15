import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./welcome-background.css";
import "./parity-fixes.css";
import "./device-regression-fixes.css";
import "./reference-parity-final.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
