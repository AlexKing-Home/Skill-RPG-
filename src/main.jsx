import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./welcome-background.css";
import "./parity-fixes.css";
import "./device-regression-fixes.css";
import "./reference-parity-final.css";
import "./mobile-polish.css";
import "./reference-ui-v8.css";
import "./navigation-reference-v2.css";
import "./navigation-reference-v9.css";
import "./navigation-unified.css";
import "./movement.css";
import "./floor-map.css";
import "./swamp-location.css";
import "./image-quality.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
