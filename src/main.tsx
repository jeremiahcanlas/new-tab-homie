import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getInitialProps } from "./utils/propUtils.ts";

async function init() {
  const props = await getInitialProps();

  console.log("INIT PROPS:", props);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App {...props} />
    </StrictMode>
  );
}

init();
