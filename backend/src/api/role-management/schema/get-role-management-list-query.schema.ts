import { z } from "zod";

export const GetRoleManagementListQuerySchema = z.object({
    name: z.string().optional(),
});

export type GetRoleManagementListQuerySchemaType = z.infer<typeof GetRoleManagementListQuerySchema>;
