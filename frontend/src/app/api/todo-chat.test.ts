import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { streamTodoChat } from "./todo-chat";

vi.mock("@/config/env", () => ({
    env: { API_URL: "/" },
}));

vi.mock("@/lib/refresh-handler", () => ({
    getAccessToken: vi.fn(() => null),
    handleRefresh: vi.fn(),
}));

describe("streamTodoChat", () => {

    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn().mockResolvedValue(
            new Response(
                new ReadableStream({
                    start(controller) {
                        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                        controller.close();
                    },
                }),
                { status: 200 }
            )
        );
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test("API_URLが相対パス('/')でも二重スラッシュにならないこと", async () => {
        const controller = new AbortController();

        await streamTodoChat("こんにちは", {
            onToken: vi.fn(),
            onDone: vi.fn(),
            onError: vi.fn(),
            signal: controller.signal,
        });

        const calledUrl = fetchMock.mock.calls[0][0] as string;
        expect(calledUrl).toBe("/api/v1/todo-chat");
    });
});
