import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { category, frontUser, frontUserLogin, frontUserLogout, frontUserPassword, health, priority, refresh, sample, status, todo, todoFavorite, todoManagement, userManagement, verify } from "./api";
import {
  accessLogMiddleware,
  createDbClientMiddleware,
  envInitMiddleware,
  errorHandler,
  notFoundHandler,
  requestIdMiddleware,
} from "./middleware";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

// ミドルウェア設定
app.use("*", envInitMiddleware);
app.use(
  '*',
  cors({
    origin: (origin, c: Context<AppEnv>) => {
      const config = c.get('envConfig');
      return config.corsOrigin.includes(origin) ? origin : '';
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);
app.use("*", requestIdMiddleware);
app.use("*", accessLogMiddleware);
app.use("*", createDbClientMiddleware);

// エラーハンドラー
app.onError(errorHandler);
app.notFound(notFoundHandler);

// ルーティング（チェーンで型情報を保持）
const routes = app
  .route("/", health)
  .route("/", sample)
  .route("/", frontUser)
  .route("/", frontUserLogin)
  .route("/", refresh)
  .route("/", verify)
  .route("/", frontUserLogout)
  .route("/", frontUserPassword)
  .route("/", category)
  .route("/", status)
  .route("/", priority)
  .route("/", todo)
  .route("/", todoFavorite)
  .route("/", todoManagement)
  .route("/", userManagement)

// RPC用の型エクスポート
export type AppType = typeof routes;

export default app;
