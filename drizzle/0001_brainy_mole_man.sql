CREATE TABLE `abandoned_carts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(100),
	`userId` int,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`items` json,
	`totalValue` decimal(10,2) NOT NULL,
	`recoveryEmailSent` boolean NOT NULL DEFAULT false,
	`recoveryEmailSentAt` timestamp,
	`isRecovered` boolean NOT NULL DEFAULT false,
	`recoveredOrderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abandoned_carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`parentId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `custom_scripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` enum('header','footer') NOT NULL,
	`content` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('percentage','fixed') NOT NULL,
	`value` decimal(10,4) NOT NULL,
	`appliesTo` enum('all','credit_card','debit_card','pix','boleto') NOT NULL DEFAULT 'all',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`minOrderValue` decimal(10,2) NOT NULL,
	`maxOrderValue` decimal(10,2),
	`stock` int NOT NULL DEFAULT 0,
	`usedCount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_bumps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`productId` int NOT NULL,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` decimal(10,2) NOT NULL,
	`triggerProductIds` json,
	`triggerMinValue` decimal(10,2),
	`displayPosition` enum('before_checkout','after_checkout','cart_page') NOT NULL DEFAULT 'before_checkout',
	`isActive` boolean NOT NULL DEFAULT true,
	`conversions` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_bumps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productImage` text,
	`variant` json,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`shippingAddress` json,
	`billingAddress` json,
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) DEFAULT '0',
	`discount` decimal(10,2) DEFAULT '0',
	`tax` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`paymentMethod` enum('credit_card','debit_card','pix','boleto') NOT NULL,
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`orderStatus` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`shippingMethod` varchar(100),
	`trackingCode` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `payment_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cardBrand` varchar(50) NOT NULL,
	`lastFourDigits` varchar(4) NOT NULL,
	`holderName` varchar(255) NOT NULL,
	`expiryMonth` int NOT NULL,
	`expiryYear` int NOT NULL,
	`tokenizedId` varchar(255),
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`costPrice` decimal(10,2),
	`sku` varchar(100),
	`barcode` varchar(100),
	`stock` int NOT NULL DEFAULT 0,
	`lowStockThreshold` int DEFAULT 10,
	`categoryId` int,
	`imageUrl` text,
	`images` json,
	`variants` json,
	`rating` decimal(2,1) DEFAULT '0',
	`soldCount` int NOT NULL DEFAULT 0,
	`status` enum('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`discount` int DEFAULT 0,
	`weight` decimal(10,2),
	`dimensions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `shipping_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('fixed','weight_based','price_based','free') NOT NULL,
	`minOrderValue` decimal(10,2),
	`maxOrderValue` decimal(10,2),
	`minWeight` decimal(10,2),
	`maxWeight` decimal(10,2),
	`price` decimal(10,2) NOT NULL,
	`estimatedDays` int,
	`regions` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipping_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
	`category` varchar(100),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `tracking_pixels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('facebook','google_analytics','google_tag_manager','tiktok','custom') NOT NULL,
	`pixelId` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`events` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracking_pixels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);