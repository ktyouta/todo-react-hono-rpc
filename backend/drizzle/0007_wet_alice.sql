PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_front_user_master` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`birthday` text NOT NULL,
	`role_id` integer NOT NULL,
	`last_login_date` text,
	`delete_flg` text DEFAULT '0' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `role_master`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_front_user_master`("id", "name", "birthday", "role_id", "last_login_date", "delete_flg", "created_at", "updated_at") SELECT "id", "name", "birthday", "role_id", "last_login_date", "delete_flg", "created_at", "updated_at" FROM `front_user_master`;--> statement-breakpoint
DROP TABLE `front_user_master`;--> statement-breakpoint
ALTER TABLE `__new_front_user_master` RENAME TO `front_user_master`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `front_user_master_name_unique` ON `front_user_master` (`name`);