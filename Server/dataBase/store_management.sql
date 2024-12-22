-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2024 at 02:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `store_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `customerId` int(100) NOT NULL,
  `userId` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(50) NOT NULL,
  `companyId` int(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `companyId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 'phone', 'cellphone smartphone', 3, 4, '2024-11-15 15:27:11', '2024-11-15 15:27:11');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(100) NOT NULL,
  `userId` int(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `userId`, `name`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'Bismillah Trade', 'Bhadergonj, Shariatpur', '2024-11-15 11:50:51.229473', '2024-11-15 05:50:51.228000'),
(2, 3, 'Bismillah Trade', 'Bhadergonj, Shariatpur', '2024-11-15 11:52:25.139292', '2024-11-15 05:52:25.138000'),
(3, 4, 'Bismillah Trade2', 'Bhadergonj, Shariatpur', '2024-11-15 11:59:37.659939', '2024-11-15 05:59:37.659000');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(100) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(50) NOT NULL,
  `balance` int(11) NOT NULL,
  `isTrader` tinyint(1) NOT NULL,
  `userId` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `address`, `balance`, `isTrader`, `userId`, `companyId`, `createdAt`, `updatedAt`) VALUES
(2, 'Sihab Chokder', 'sihabchokder@gmail.com', '01914162616', 'Goydda', 0, 0, 4, 3, '2024-11-15 15:46:43', '2024-11-15 15:46:43'),
(3, 'jahid Chokder', 'jahidchokder@gmail.com', '0178546985', 'Goydda', 28000, 0, 4, 3, '2024-11-15 15:47:34', '2024-11-15 15:47:34');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `customerId` int(100) NOT NULL,
  `userId` int(100) NOT NULL,
  `paymentSlip` varchar(50) NOT NULL,
  `account` varchar(30) NOT NULL,
  `method` varchar(20) NOT NULL,
  `amount` int(20) NOT NULL,
  `prevDueBalance` int(20) NOT NULL,
  `currentDueBalance` int(20) NOT NULL,
  `note` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `companyId`, `customerId`, `userId`, `paymentSlip`, `account`, `method`, `amount`, `prevDueBalance`, `currentDueBalance`, `note`, `createdAt`, `updatedAt`) VALUES
(25, 3, 3, 4, 'REC-100', 'ss', 'cash', 3000, -25000, -28000, 'test', '2024-11-13 05:39:48', '2024-11-13 05:39:48');

-- --------------------------------------------------------

--
-- Table structure for table `paymentsfor`
--

CREATE TABLE `paymentsfor` (
  `id` int(11) NOT NULL,
  `companyId` int(100) NOT NULL,
  `paymentSlip` varchar(20) NOT NULL,
  `invoiceNo` varchar(20) NOT NULL,
  `amount` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentsfor`
--

INSERT INTO `paymentsfor` (`id`, `companyId`, `paymentSlip`, `invoiceNo`, `amount`) VALUES
(12, 3, 'REC-100', 'S-500', 2000),
(13, 3, 'REC-100', 'S-500', 2000),
(14, 3, 'REC-101', 'S-500', 2000),
(15, 3, 'REC-101', 'S-500', 2000),
(16, 3, 'REC-102', 'S-500', 2000),
(17, 3, 'REC-102', 'S-500', 2000),
(18, 3, 'REC-103', 'S-500', 2000),
(19, 3, 'REC-103', 'S-500', 2000),
(20, 3, 'REC-104', 'S-500', 2000),
(21, 3, 'REC-104', 'S-500', 2000),
(22, 3, 'REC-105', 'S-500', 2000),
(23, 3, 'REC-105', 'S-500', 2000),
(26, 3, 'REC-106', 'S-500', 2000),
(27, 3, 'REC-106', 'S-500', 2000),
(28, 3, 'REC-107', 'S-500', 2000),
(29, 3, 'REC-107', 'S-500', 2000),
(31, 3, 'REC-108', 'S-500', 2000),
(32, 3, 'REC-109', 'S-500', 2000),
(33, 3, 'REC-109', 'S-500', 2000),
(34, 3, 'REC-100', 'S-500', 2000),
(35, 3, 'REC-100', 'S-500', 2000);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `categoryId` int(100) NOT NULL,
  `buyingTaxId` int(100) NOT NULL,
  `sellingTaxId` int(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `barcode` int(100) NOT NULL,
  `buyingPrice` int(10) NOT NULL,
  `sellingPrice` int(10) NOT NULL,
  `measurementUnitId` int(100) NOT NULL,
  `userId` int(100) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `warranty` int(10) NOT NULL,
  `warrantyType` varchar(20) NOT NULL,
  `img` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `companyId`, `categoryId`, `buyingTaxId`, `sellingTaxId`, `name`, `barcode`, `buyingPrice`, `sellingPrice`, `measurementUnitId`, `userId`, `isActive`, `warranty`, `warrantyType`, `img`, `createdAt`, `updatedAt`) VALUES
(1, 3, 5487, 54865, 9875, '5mp camera', 54875, 2500, 3000, 54, 4, 0, 5, 'years', 'null', '2024-11-15 14:57:13', '2024-11-15 14:57:13');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `companyId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `invoiceNo` varchar(11) NOT NULL,
  `totalAmount` int(11) NOT NULL,
  `dueAmount` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `companyId`, `customerId`, `userId`, `invoiceNo`, `totalAmount`, `dueAmount`, `createdAt`, `updatedAt`) VALUES
(1, 3, 3, 4, 'S-500', 5000, 0, '2024-11-15 18:12:16', '2024-11-15 18:12:16');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` int(100) NOT NULL,
  `itemSerials` int(100) NOT NULL,
  `wireHouseName` varchar(50) NOT NULL,
  `wireHouseId` int(100) NOT NULL,
  `quantity` int(50) NOT NULL,
  `productId` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `barcode` int(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `itemSerials`, `wireHouseName`, `wireHouseId`, `quantity`, `productId`, `companyId`, `barcode`, `createdAt`, `updatedAt`) VALUES
(1, 25, 'ghfhbsfgh', 54, 20, 1, 3, 54875, '2024-11-15 14:57:13', '2024-11-15 14:57:13'),
(2, 25, 'vdfdsfgds', 65, 10, 1, 3, 54875, '2024-11-15 14:57:13', '2024-11-15 14:57:13');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(100) NOT NULL,
  `companyId` int(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `companyId`, `name`, `email`, `phone`, `password`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
(3, 2, 'Sihab Chokder', 'sihabchokder@gmail.com', '01256458792', '$2b$12$2yVspPF9oUMBAoTMsbDgRuUGMBRqPmyH1BaDERVk6IqfY8lNErhAS', 'admin', 'active', '2024-11-15 11:40:17', '2024-11-15 05:52:25'),
(4, 3, 'Foysal Dhali', 'foysaldhali989@gmail.com', '01914162612', '$2b$12$xfBmF8BTz1yGbJUpfYgafOVJpL7Z7X5xte8.b4.K83M2B47/PHx8G', 'superAdmin', 'active', '2024-11-15 11:58:10', '2024-11-15 05:59:37'),
(5, 3, 'Himu Chokder', 'himuchjokder@gmail.com', '08319935981', '$2b$12$8Kzv//LDlKYV1dmeQE0qp.oREXXYM5qnckTVwPcQh4nYqFcUBtlaK', 'user', 'active', '2024-11-15 12:01:56', '2024-11-15 06:21:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paymentsfor`
--
ALTER TABLE `paymentsfor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `paymentsfor`
--
ALTER TABLE `paymentsfor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
