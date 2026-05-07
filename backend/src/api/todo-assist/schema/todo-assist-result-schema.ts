import { z } from "zod";

export const TodoAssistResultSchema = z.object({
    title: z.string().transform(v => v.slice(0, 200)),
    content: z.string().transform(v => v.slice(0, 2000)),
});

export type TodoAssistResultSchemaType = z.infer<typeof TodoAssistResultSchema>;
