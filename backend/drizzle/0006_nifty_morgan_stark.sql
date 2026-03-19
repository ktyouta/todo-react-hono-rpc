CREATE TABLE `permission_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`screen` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permission_master_screen_unique` ON `permission_master` (`screen`);--> statement-breakpoint
CREATE TABLE `role_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_master_name_unique` ON `role_master` (`name`);--> statement-breakpoint
CREATE TABLE `role_permission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role_id` integer NOT NULL,
	`permission_id` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `role_master`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permission_master`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_permission_unique` ON `role_permission` (`role_id`,`permission_id`);--> statement-breakpoint
ALTER TABLE `front_user_master` ADD `role_id` integer REFERENCES role_master(id);