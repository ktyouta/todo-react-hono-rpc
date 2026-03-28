import { z } from "zod";

export const UserDeletedIdParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: "ユーザーIDは数値で指定してください" }).int().positive(),
});

export type UserDeletedIdParamSchemaType = z.infer<typeof UserDeletedIdParamSchema>;
