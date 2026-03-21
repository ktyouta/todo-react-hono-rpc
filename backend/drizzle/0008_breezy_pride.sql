PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_front_user_login_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`delete_flg` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_front_user_login_master`("id", "name", "password", "salt", "delete_flg", "created_at", "updated_at") SELECT "id", "name", "password", "salt", "delete_flg", "created_at", "updated_at" FROM `front_user_login_master`;--> statement-breakpoint
DROP TABLE `front_user_login_master`;--> statement-breakpoint
ALTER TABLE `__new_front_user_login_master` RENAME TO `front_user_login_master`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `front_user_login_master_name_unique` ON `front_user_login_master` (`name`);--> statement-breakpoint
CREATE TABLE `__new_front_user_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`birthday` text NOT NULL,
	`role_id` integer NOT NULL,
	`last_login_date` text,
	`delete_flg` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `role_master`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_front_user_master`("id", "name", "birthday", "role_id", "last_login_date", "delete_flg", "created_at", "updated_at") SELECT "id", "name", "birthday", "role_id", "last_login_date", "delete_flg", "created_at", "updated_at" FROM `front_user_master`;--> statement-breakpoint
DROP TABLE `front_user_master`;--> statement-breakpoint
ALTER TABLE `__new_front_user_master` RENAME TO `front_user_master`;--> statement-breakpoint
CREATE UNIQUE INDEX `front_user_master_name_unique` ON `front_user_master` (`name`);--> statement-breakpoint
CREATE TABLE `__new_sample` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`delete_flg` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sample`("id", "name", "description", "delete_flg", "created_at", "updated_at") SELECT "id", "name", "description", "delete_flg", "created_at", "updated_at" FROM `sample`;--> statement-breakpoint
DROP TABLE `sample`;--> statement-breakpoint
ALTER TABLE `__new_sample` RENAME TO `sample`;--> statement-breakpoint
CREATE TABLE `__new_task_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`category_id` integer DEFAULT 1 NOT NULL,
	`status_id` integer,
	`priority_id` integer,
	`due_date` text,
	`user_id` integer,
	`delete_flg` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_task_transaction`("id", "title", "content", "category_id", "status_id", "priority_id", "due_date", "user_id", "delete_flg", "created_at", "updated_at") SELECT "id", "title", "content", "category_id", "status_id", "priority_id", "due_date", "user_id", "delete_flg", "created_at", "updated_at" FROM `task_transaction`;--> statement-breakpoint
DROP TABLE `task_transaction`;--> statement-breakpoint
ALTER TABLE `__new_task_transaction` RENAME TO `task_transaction`;