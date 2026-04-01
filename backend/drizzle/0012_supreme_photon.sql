ALTER TABLE `permission_master` ADD `is_protected` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `role_master` ADD `is_protected` integer DEFAULT 0 NOT NULL;