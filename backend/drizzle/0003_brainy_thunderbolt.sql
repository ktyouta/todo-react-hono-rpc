PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_task_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`category_id` integer DEFAULT 1 NOT NULL,
	`status_id` integer,
	`user_id` integer,
	`delete_flg` text DEFAULT '0' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_task_transaction`("id", "title", "content", "category_id", "status_id", "user_id", "delete_flg", "created_at", "updated_at") SELECT "id", "title", "content", "category_id", "status_id", "user_id", "delete_flg", "created_at", "updated_at" FROM `task_transaction`;--> statement-breakpoint
DROP TABLE `task_transaction`;--> statement-breakpoint
ALTER TABLE `__new_task_transaction` RENAME TO `task_transaction`;--> statement-breakpoint
PRAGMA foreign_keys=ON;