import { Elysia, t } from "elysia";

export const routeModel = new Elysia({ name: "Model.Route" }).model({
  "route.create": t.Object({
    assignmentId: t.String(),
    endLatitude: t.Union([t.String(), t.Number()]),
    endLongitude: t.Union([t.String(), t.Number()]),
    name: t.String(),
    driveDate: t.String({
      format: "date",
    }),
    comments: t.Optional(t.String()),
  }),
  "route.get": t.Object({
    id: t.String(),
  }),
  "route.update": t.Object({
    assignmentId: t.String(),
    endLatitude: t.Union([t.String(), t.Number()]),
    endLongitude: t.Union([t.String(), t.Number()]),
    name: t.String(),
    driveDate: t.String({
      format: "date",
    }),
    comments: t.Nullable(t.String()),
    success: t.Nullable(t.Boolean()),
    problemDescription: t.Nullable(t.String()),
  }),
});
