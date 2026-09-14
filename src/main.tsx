import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createLightTheme, FluentProvider, type BrandVariants } from "@fluentui/react-components";
import App from "./App";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./styles.css";

const plnBlue: BrandVariants = {
  10: "#00243A",
  20: "#00324D",
  30: "#004261",
  40: "#005276",
  50: "#00628B",
  60: "#0073A2",
  70: "#0961A8",
  80: "#0879D1",
  90: "#1694F5",
  100: "#6DBEFF",
  110: "#86CAFF",
  120: "#A3D6FF",
  130: "#B9DFFF",
  140: "#D0E9FF",
  150: "#DCEFFF",
  160: "#EFF8FF",
};

const theme = createLightTheme(plnBlue);
theme.fontFamilyBase = "Inter, ui-sans-serif, system-ui, sans-serif";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FluentProvider theme={theme}>
      <App />
    </FluentProvider>
  </StrictMode>,
);
