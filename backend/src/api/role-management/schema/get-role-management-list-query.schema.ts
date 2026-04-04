import { z } from "zod";

export const GetRoleManagementListQuerySchema = z.object({
    name: z.string().optional(),
    page: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().positive().default(1)
    ),
});

export type GetRoleManagementListQuerySchemaType = z.infer<typeof GetRoleManagementListQuerySchema>;
