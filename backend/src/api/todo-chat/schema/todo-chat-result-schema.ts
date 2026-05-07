import { z } from "zod";

export const TodoChatResultSchema = z.object({
    message: z.string().transform(v => v.slice(0, 2000)),
});

export type TodoChatResultSchemaType = z.infer<typeof TodoChatResultSchema>;
