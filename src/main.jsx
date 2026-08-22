import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/foundation.css";
import "./styles/compatibility.css";
import "./styles/navigation.css";
import "./styles/world.css";
import "./styles/character.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
