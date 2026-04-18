import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { adminDashboardStats, category, frontUser, frontUserLogin, frontUserLogout, frontUserPassword, health, priority, refresh, roleManagement, sample, status, todo, todoBulkDelete, todoBulkUpdate, todoDeleted, todoDeletedBulkRestore, todoDeletedRestore, todoDeletedSubtask, todoFavorite, todoManagement, todoManagementBulkDelete, todoManagementBulkUpdate, todoManagementSubtask, todoStats, todoSubtask, todoTrash, todoTrashBulkRestore, todoTrashRestore, todoTrashSubtask, userDeleted, userDeletedBulkRestore, userDeletedRestore, userList, userManagement, userManagementBulkDelete, userManagementBulkRole, userManagementPassword, userManagementRole, verify } from "./api";
import { permissionList } from "./api/permission-list";
import { roleList } from "./api/role-list";
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
  .route("/", todoTrashBulkRestore)
  .route("/", todoTrashSubtask)
  .route("/", todoTrash)
  .route("/", todoTrashRestore)
  .route("/", todoBulkDelete)
  .route("/", todoBulkUpdate)
  .route("/", todoStats)
  .route("/", adminDashboardStats)
  .route("/", todoSubtask)
  .route("/", todo)
  .route("/", todoFavorite)
  .route("/", todoManagementBulkDelete)
  .route("/", todoManagementBulkUpdate)
  .route("/", todoManagementSubtask)
  .route("/", todoManagement)
  .route("/", todoDeletedBulkRestore)
  .route("/", todoDeletedSubtask)
  .route("/", todoDeleted)
  .route("/", todoDeletedRestore)
  .route("/", userList)
  .route("/", userManagementBulkRole)
  .route("/", userManagementBulkDelete)
  .route("/", userManagement)
  .route("/", userManagementRole)
  .route("/", userManagementPassword)
  .route("/", roleList)
  .route("/", permissionList)
  .route("/", roleManagement)
  .route("/", userDeletedBulkRestore)
  .route("/", userDeleted)
  .route("/", userDeletedRestore)

// RPC用の型エクスポート
export type AppType = typeof routes;

export default app;
