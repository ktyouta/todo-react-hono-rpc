import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * サンプルテーブルスキーマ
 */
export const sample = sqliteTable("sample", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  deleteFlg: integer("delete_flg", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type Sample = typeof sample.$inferSelect;
export type NewSample = typeof sample.$inferInsert;

/**
 * ロールマスタ
 */
export const roleMaster = sqliteTable("role_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  isProtected: integer("is_protected", { mode: "boolean" }).notNull().default(false),
  isImmutable: integer("is_immutable", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type RoleMaster = typeof roleMaster.$inferSelect;
export type NewRoleMaster = typeof roleMaster.$inferInsert;

/**
 * 画面マスタ
 */
export const screenMaster = sqliteTable("screen_master", {
  id: integer("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type ScreenMaster = typeof screenMaster.$inferSelect;
export type NewScreenMaster = typeof screenMaster.$inferInsert;

/**
 * パーミッションマスタ
 */
export const permissionMaster = sqliteTable("permission_master", {
  id: integer("id").primaryKey(),
  screenId: integer("screen_id").notNull().unique().references(() => screenMaster.id),
  isProtected: integer("is_protected", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type PermissionMaster = typeof permissionMaster.$inferSelect;
export type NewPermissionMaster = typeof permissionMaster.$inferInsert;

/**
 * ロール・パーミッション中間テーブル
 */
export const rolePermission = sqliteTable("role_permission", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roleId: integer("role_id").notNull().references(() => roleMaster.id),
  permissionId: integer("permission_id").notNull().references(() => permissionMaster.id),
}, (table) => [
  uniqueIndex("role_permission_unique").on(table.roleId, table.permissionId),
]);

export type RolePermission = typeof rolePermission.$inferSelect;
export type NewRolePermission = typeof rolePermission.$inferInsert;

/**
 * フロントユーザーマスタ
 */
export const frontUserMaster = sqliteTable("front_user_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  birthday: text("birthday").notNull(),
  roleId: integer("role_id").notNull().references(() => roleMaster.id),
  lastLoginDate: text("last_login_date"),
  deleteFlg: integer("delete_flg", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type FrontUserMaster = typeof frontUserMaster.$inferSelect;
export type NewFrontUserMaster = typeof frontUserMaster.$inferInsert;

/**
 * フロントユーザーログインマスタ
 */
export const frontUserLoginMaster = sqliteTable("front_user_login_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  deleteFlg: integer("delete_flg", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type FrontUserLoginMaster = typeof frontUserLoginMaster.$inferSelect;
export type NewFrontUserLoginMaster = typeof frontUserLoginMaster.$inferInsert;

/**
 * シーケンスマスタ（ID採番用）
 */
export const seqMaster = sqliteTable("seq_master", {
  key: text("key").primaryKey(),
  nextId: integer("next_id").notNull().default(1),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type SeqMaster = typeof seqMaster.$inferSelect;
export type NewSeqMaster = typeof seqMaster.$inferInsert;

/**
 * カテゴリマスタ
 */
export const categoryMaster = sqliteTable("category_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type CategoryMaster = typeof categoryMaster.$inferSelect;
export type NewCategoryMaster = typeof categoryMaster.$inferInsert;

/**
 * ステータスマスタ
 */
export const statusMaster = sqliteTable("status_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type StatusMaster = typeof statusMaster.$inferSelect;
export type NewStatusMaster = typeof statusMaster.$inferInsert;

/**
 * 優先度マスタ
 */
export const priorityMaster = sqliteTable("priority_master", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type PriorityMaster = typeof priorityMaster.$inferSelect;
export type NewPriorityMaster = typeof priorityMaster.$inferInsert;

/**
 * タスクテーブルスキーマ
 */
export const taskTransaction = sqliteTable("task_transaction", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  categoryId: integer("category_id").notNull().default(1),
  statusId: integer("status_id"),
  priorityId: integer("priority_id"),
  dueDate: text("due_date"),
  userId: integer("user_id"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
  deleteFlg: integer("delete_flg", { mode: "boolean" }).notNull().default(false),
  parentId: integer("parent_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type TaskTransaction = typeof taskTransaction.$inferSelect;
export type NewTaskTransaction = typeof taskTransaction.$inferInsert;
