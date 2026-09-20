import { beforeEach, describe, expect, test, vi } from "vitest";
import { getAccessToken, handleRefresh } from "@/lib/refresh-handler";
import { rpc } from "../rpc-client";

// env のモック
vi.mock("@/config/env", () => ({
    env: { API_URL: "http://localhost:8787" },
}));

// refresh-handler のモック
vi.mock("@/lib/refresh-handler", () => ({
    getAccessToken: vi.fn(),
    handleRefresh: vi.fn(),
}));

const CONNECTION_ERROR_MESSAGE = "通信エラーが発生しました。しばらくしてから再度お試しください。";

describe("rpc-client", () => {

    // fetch のモック
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("fetch", fetchMock);
        vi.mocked(getAccessToken).mockReturnValue("old-token");
    });

    test("バックエンドに接続できない場合、生の例外ではなく503のエラーレスポンスを返す", async () => {

        fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

        const res = await rpc.api.v1.verify.$get();

        expect(res.ok).toBe(false);
        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ message: CONNECTION_ERROR_MESSAGE });
    });

    test("401後のリトライで通信エラーになった場合、生の例外ではなく503のエラーレスポンスを返す", async () => {

        fetchMock
            .mockResolvedValueOnce(new Response(JSON.stringify({ message: "認証エラー" }), { status: 401 }))
            .mockRejectedValueOnce(new TypeError("Failed to fetch"));
        vi.mocked(handleRefresh).mockResolvedValue("new-token");

        const res = await rpc.api.v1.verify.$get();

        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ message: CONNECTION_ERROR_MESSAGE });
    });

    test("リフレッシュに失敗した場合、元の401レスポンスを返す", async () => {

        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ message: "認証エラー" }), { status: 401 }));
        vi.mocked(handleRefresh).mockRejectedValue(new Error("refresh failed"));

        const res = await rpc.api.v1.verify.$get();

        expect(res.status).toBe(401);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("リフレッシュに成功した場合、新しいトークンでリトライした結果を返す", async () => {

        fetchMock
            .mockResolvedValueOnce(new Response(JSON.stringify({ message: "認証エラー" }), { status: 401 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ data: {} }), { status: 200 }));
        vi.mocked(handleRefresh).mockResolvedValue("new-token");

        const res = await rpc.api.v1.verify.$get();

        expect(res.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledTimes(2);

        const retryHeaders = new Headers(fetchMock.mock.calls[1][1].headers);
        expect(retryHeaders.get("Authorization")).toBe("Bearer new-token");
    });
});
