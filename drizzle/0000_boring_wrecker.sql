CREATE TABLE `stored_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`url` varchar(768) NOT NULL,
	`mimeType` varchar(160) NOT NULL,
	`sizeBytes` int NOT NULL,
	`category` enum('story','training','report','media','other') NOT NULL DEFAULT 'other',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stored_files_id` PRIMARY KEY(`id`),
	CONSTRAINT `stored_files_fileKey_unique` UNIQUE(`fileKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
