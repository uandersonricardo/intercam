import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { registerSW } from "virtual:pwa-register";

import { AuthProvider } from "./contexts/Auth";
import Router from "./router";
import theme from "./styles/theme";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
