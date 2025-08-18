import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getInitialProps } from "./utils/appUtils.ts";

async function init() {
  const props = await getInitialProps();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App {...props} />
    </StrictMode>
  );
}

init();
