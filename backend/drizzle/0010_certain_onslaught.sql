CREATE TABLE `screen_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `screen_master_key_unique` ON `screen_master` (`key`);--> statement-breakpoint
ALTER TABLE `permission_master` ADD `screen_id` integer REFERENCES screen_master(id);
--> statement-breakpoint
INSERT INTO `screen_master` (`id`, `key`, `name`, `created_at`, `updated_at`) VALUES
  (1, 'task_management',         'タスク管理',       datetime('now'), datetime('now')),
  (2, 'user_management',         'ユーザー管理',     datetime('now'), datetime('now')),
  (3, 'deleted_task_management', '削除タスク管理',   datetime('now'), datetime('now')),
  (4, 'deleted_user_management', '削除ユーザー管理', datetime('now'), datetime('now')),
  (5, 'user_create',             'ユーザー作成',     datetime('now'), datetime('now'));
--> statement-breakpoint
UPDATE `permission_master`
SET `screen_id` = (
  SELECT `id` FROM `screen_master`
  WHERE `screen_master`.`key` = `permission_master`.`screen`
);