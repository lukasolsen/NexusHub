import { RootRoute } from "@tanstack/react-router";

import Layout from "./components/Layout";

export const rootRoute = new RootRoute({
  component: Layout,
});

export default rootRoute;
