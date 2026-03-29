-- role_permission のデータを一時テーブルに退避
CREATE TABLE `__backup_role_permission` AS SELECT * FROM `role_permission`;
--> statement-breakpoint
-- role_permission の unique index を削除
DROP INDEX `role_permission_unique`;
--> statement-breakpoint
-- role_permission テーブルを削除（permission_master への FK を解除）
DROP TABLE `role_permission`;
--> statement-breakpoint
-- permission_master を再作成（screen カラム削除、screen_id を NOT NULL + UNIQUE）
CREATE TABLE `__new_permission_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`screen_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`screen_id`) REFERENCES `screen_master`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_permission_master`("id", "screen_id", "created_at", "updated_at") SELECT "id", "screen_id", "created_at", "updated_at" FROM `permission_master`;
--> statement-breakpoint
DROP TABLE `permission_master`;
--> statement-breakpoint
ALTER TABLE `__new_permission_master` RENAME TO `permission_master`;
--> statement-breakpoint
CREATE UNIQUE INDEX `permission_master_screen_id_unique` ON `permission_master` (`screen_id`);
--> statement-breakpoint
-- role_permission テーブルを再作成
CREATE TABLE `role_permission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role_id` integer NOT NULL,
	`permission_id` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `role_master`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permission_master`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
-- データを復元
INSERT INTO `role_permission`("id", "role_id", "permission_id") SELECT "id", "role_id", "permission_id" FROM `__backup_role_permission`;
--> statement-breakpoint
CREATE UNIQUE INDEX `role_permission_unique` ON `role_permission` (`role_id`,`permission_id`);
--> statement-breakpoint
-- 一時テーブルを削除
DROP TABLE `__backup_role_permission`;
