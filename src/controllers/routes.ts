import Elysia from "elysia";
import { routeModel } from "../models/route";
import { authService } from "../services/auth";
import {
  CannotDeleteRouteError,
  InvalidRouteError,
  RouteService,
} from "../services/route";

export const routesController = new Elysia({ prefix: "/routes" })
  .use(authService)
  .use(routeModel)
  // POST /routes
  .post(
    "/",
    async ({ user, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const route = await RouteService.createRoute(body);
        return { route };
      } catch (e) {
        if (e instanceof InvalidRouteError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      body: "route.create",
    },
  )
  // GET /routes
  .get("/", async ({ user, error }) => {
    if (!user) return error(401, { error: "Unauthorized" });

    const routes = await RouteService.getAllRoutes();
    return { items: routes };
  })
  // GET /routes/:id
  .get(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      const route = await RouteService.getRouteById(id);
      if (route === undefined) return error(404, { error: "Route not found" });
      return route;
    },
    {
      params: "route.get",
    },
  )
  // PUT /routes/:id
  .put(
    "/:id",
    async ({ user, params: { id }, body, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });      
      try {
        const updatedId = await RouteService.updateRouteById(id, body);
        return { id: updatedId };
      } catch (e) {
        if (e instanceof InvalidRouteError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      body: "route.update",
      params: "route.get",
    },
  )
  // DELETE /routes/:id
  .delete(
    "/:id",
    async ({ user, params: { id }, error }) => {
      if (!user) return error(401, { error: "Unauthorized" });

      try {
        const deletedId = await RouteService.deleteRouteById(id);
        return { id: deletedId };
      } catch (e) {
        if (e instanceof CannotDeleteRouteError) {
          return error(400, { error: e.message });
        }
      }
    },
    {
      params: "route.get",
    },
  );
