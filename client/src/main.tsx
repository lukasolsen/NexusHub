import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, Router, Route } from "@tanstack/react-router";
import rootRoute from "./__root";
import { AboutRoute } from "./routes/about";
import App from "./routes";
import "./index.css";
import { LoginRoute } from "./routes/login";
import { RegisterRoute } from "./routes/register";

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutRoute,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRoute,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  registerRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
