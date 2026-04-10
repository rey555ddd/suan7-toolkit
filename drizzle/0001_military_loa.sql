CREATE TABLE `suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('feature','bug','improvement','other') NOT NULL DEFAULT 'other',
	`content` text NOT NULL,
	`status` enum('pending','reviewing','done','rejected') NOT NULL DEFAULT 'pending',
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suggestions_id` PRIMARY KEY(`id`)
);
