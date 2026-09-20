import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import SessionManager from "./session";

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <NuqsAdapter>
        <RouterProvider router={router}></RouterProvider>
      </NuqsAdapter>
    </Provider>,
  );
};

const bootstrapKioskSession = async () => {
  const response = await fetch("/api/v4/session/kiosk", {
    credentials: "same-origin",
  });
  const payload = await response.json();

  if (!response.ok || payload?.code !== 0 || !payload?.data?.user || !payload?.data?.token) {
    throw new Error(payload?.msg || "Failed to bootstrap kiosk session");
  }

  // Always refresh the kiosk token when the UI starts. This also repairs a
  // stale/expired browser session without showing the login page.
  SessionManager.upsert(payload.data);

  // The old login route can still exist for compatibility links, but the
  // normal kiosk entry must never stop on the login screen.
  if (window.location.pathname === "/session") {
    window.history.replaceState({}, "", "/home");
  }
};

void bootstrapKioskSession()
  .catch((error) => {
    // Fail open to the legacy UI so a broken kiosk configuration can still be
    // repaired by an administrator instead of leaving a blank page.
    console.error("Failed to bootstrap kiosk session", error);
  })
  .finally(renderApp);
