import ReactDOM from "react-dom/client";
import { RouterProvider, Router, Route } from "@tanstack/react-router";
import rootRoute from "./__root";
import { AboutRoute } from "./routes/about";
import App from "./routes";
import "./index.css";
import { LoginRoute } from "./routes/login";
import { RegisterRoute } from "./routes/register";
import ProfileRouteToken from "./routes/profile";
import ProfileRoute from "./routes/profile";

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

const profileIdRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile/$profileId",
  component: ProfileRouteToken,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  registerRoute,
  profileIdRoute,
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
  root.render(<RouterProvider router={router} />);
}
