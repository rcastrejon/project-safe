import { Elysia, t } from "elysia";

export const routeModel = new Elysia({ name: "Model.Route" }).model({
  "route.create": t.Object({
    assignmentId: t.String(),
    startLatitude: t.String(),
    startLongitude: t.String(),
    endLongitude: t.String(),
    endLatitude: t.String(),
    name: t.String(),
    driveDate: t.String({
      format: "date",
    }),
    success: t.Nullable(t.Boolean()),
    problemDescription: t.Nullable(t.String()),
    comments: t.Nullable(t.String()),
  }),
  "route.get": t.Object({
    id: t.String(),
  }),
  "route.update": t.Object({
    id: t.String(),
    assignmentId: t.String(),
    startLatitude: t.String(),
    startLongitude: t.String(),
    endLongitude: t.String(),
    endLatitude: t.String(),
    name: t.String(),
    driveDate: t.String({
      format: "date",
    }),
    success: t.Nullable(t.Boolean()),
    problemDescription: t.Nullable(t.String()),
    comments: t.Nullable(t.String()),
  })
});
