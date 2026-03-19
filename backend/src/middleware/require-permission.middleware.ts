import type { MiddlewareHandler } from "hono";
import { PermissionRepository, PermissionService } from "../auth";
import { HTTP_STATUS } from "../constant";
import { AccessToken } from "../domain";
import { Header } from "../domain/header";
import type { AppEnv } from "../type";

/**
 * パーミッションガードミドルウェア
 * @param permission 必要なパーミッション（screen名）
 */
export function requirePermission(permission: string): MiddlewareHandler<AppEnv> {
    return async (c, next) => {
        try {
            const config = c.get("envConfig");
            const header = new Header(c.req.raw);
            const accessToken = AccessToken.get(header, config);
            const userId = await accessToken.getPayload();

            const db = c.get("db");
            const repository = new PermissionRepository(db);
            const service = new PermissionService(repository);

            const permissions = await service.getPermissions(userId);

            if (!permissions.includes(permission)) {
                return c.json({ message: "権限がありません" }, HTTP_STATUS.FORBIDDEN);
            }

            await next();
        } catch (err) {
            console.error("Permission check error:", err);
            return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
        }
    };
}
