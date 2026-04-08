/**
 * APIエンドポイント定数
 */
export const API_ENDPOINT = {
  HEALTH: "/api/v1/health",
  SAMPLE: "/api/v1/sample",
  FRONT_USER: "/api/v1/frontuser",
  FRONT_USER_ID: "/api/v1/frontuser/:userId",
  FRONT_USER_LOGIN: "/api/v1/frontuser-login",
  REFRESH: "/api/v1/refresh",
  VERIFY: "/api/v1/verify",
  LOGOUT: "/api/v1/frontuser-logout",
  FRONT_USER_PASSWORD: "/api/v1/frontuser-password/:userId",
  TODO: "/api/v1/todo",
  TODO_ID: "/api/v1/todo/:id",
  TODO_FAVORITE: "/api/v1/todo/:id/favorite",
  TODO_MANAGEMENT: "/api/v1/todo-management",
  TODO_MANAGEMENT_ID: "/api/v1/todo-management/:id",
  TODO_DELETED: "/api/v1/todo-deleted",
  TODO_DELETED_ID: "/api/v1/todo-deleted/:id",
  TODO_DELETED_RESTORE: "/api/v1/todo-deleted/:id/restore",
  USER_LIST: "/api/v1/user-list",
  USER_MANAGEMENT: "/api/v1/user-management",
  USER_MANAGEMENT_ID: "/api/v1/user-management/:id",
  USER_MANAGEMENT_ROLE: "/api/v1/user-management/:id/role",
  USER_MANAGEMENT_PASSWORD: "/api/v1/user-management/:id/password",
  CATEGORY: "/api/v1/category",
  STATUS: "/api/v1/status",
  PRIORITY: "/api/v1/priority",
  ROLE_LIST: "/api/v1/role-list",
  PERMISSION_LIST: "/api/v1/permission-list",
  USER_DELETED: "/api/v1/user-deleted",
  USER_DELETED_ID: "/api/v1/user-deleted/:id",
  USER_DELETED_RESTORE: "/api/v1/user-deleted/:id/restore",
  ROLE_MANAGEMENT: "/api/v1/role-management",
  ROLE_MANAGEMENT_ID: "/api/v1/role-management/:roleId",
  TODO_BULK: "/api/v1/todo/bulk",
  TODO_MANAGEMENT_BULK: "/api/v1/todo-management/bulk",
  TODO_DELETED_BULK_RESTORE: "/api/v1/todo-deleted/bulk/restore",
  USER_MANAGEMENT_BULK: "/api/v1/user-management/bulk",
  USER_MANAGEMENT_BULK_ROLE: "/api/v1/user-management/bulk/role"
} as const;

export type ApiEndpointType = (typeof API_ENDPOINT)[keyof typeof API_ENDPOINT];
