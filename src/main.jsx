import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-phone-number-input/style.css";
import "./index.css";
import App from "./App.jsx";
import { VideoInterviewProvider } from "./Contexts/VideoInterviewContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VideoInterviewProvider>
      <App />
    </VideoInterviewProvider>
  </StrictMode>
);
