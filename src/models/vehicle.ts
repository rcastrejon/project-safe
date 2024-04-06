import { Elysia, t } from "elysia";

export const vehicleModel = new Elysia({ name: "Model.Vehicle "}).model({
    "vehicle.create": t.Object({
        brand: t.String({
            minLength: 1,
            maxLength: 256,
        }),
        model: t.String({
            minLength: 1,
            maxLength: 256,
        }),
        vin: t.String({
            minLength: 1,
            maxLength: 256,
        }),
        plate: t.String({
            minLength: 1,
            maxLength: 256,
        }),
        purchaseDate: t.String({
            format: "date"
        }),
        cost: t.Number(),
        photo: t.String({
            minLength: 8,
            maxLength: 256,
        }),
        registrationDate: t.String({
            format: "date"
        }),
    }),
    "vehicle.get": t.Object({
        id: t.String(),
    }),
});