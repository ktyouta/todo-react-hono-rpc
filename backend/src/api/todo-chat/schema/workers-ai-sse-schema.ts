import { z } from "zod";

/**
 * Workers AI SSE チャンクのスキーマ
 */
export const WorkersAiSseSchema = z.object({
    response: z.string(),
});
