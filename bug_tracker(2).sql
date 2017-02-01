-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 01, 2017 at 04:48 PM
-- Server version: 5.5.53-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bug_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `bugs`
--

CREATE TABLE IF NOT EXISTS `bugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `bug_type` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `project_id` int(11) NOT NULL,
  `file` varchar(100) NOT NULL,
  `method` varchar(100) NOT NULL,
  `line` int(11) DEFAULT NULL,
  `priority` varchar(20) NOT NULL,
  `severity` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `tester_id` int(11) NOT NULL,
  `developer_id` int(11) DEFAULT NULL,
  `reject_reason` varchar(200) DEFAULT NULL,
  `screenshot` varchar(500) NOT NULL DEFAULT 'noscreen21.png',
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `developer_id` (`developer_id`),
  KEY `tester_id` (`tester_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=87 ;

--
-- Dumping data for table `bugs`
--

INSERT INTO `bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `tester_id`, `developer_id`, `reject_reason`, `screenshot`, `date`) VALUES
(24, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Closed', 4, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(25, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Resolving', 4, 5, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(26, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 4, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(27, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Resolving', 2, 3, 'Not working', 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(28, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Closed', 2, 5, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(29, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 2, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(30, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 8, 9, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(31, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Assigned', 8, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(32, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Assigned', 8, 9, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(33, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Resolving', 10, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(34, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Open', 10, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(35, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Open', 10, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(36, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review', 4, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(37, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Review', 4, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(38, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 4, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(39, 'AJAX error 3', 'Type B', '  Nimish David Mathew Kottummel Thrayil House Vakkadu P.O 2 ', 1, 'File2', 'Ok2', 562, 'High', 'Minor', 'Review', 2, 3, 'Nothing', 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(40, 'No display in', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O  ', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(41, 'No input ok', 'Type C', ' Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ok', 1, 'Files ok', 'Ok ok', 560, 'Moderate', 'Critical', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(42, 'sdasdfdsfsdfsdfds', 'Type B', 'asdasdasdasdasdasdsadasdasdasdasdasdasdasdasdasdadas ', 1, 'okokokoko', 'okokoko', 1, 'Moderate', 'Minor', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(43, 'sdffgdsgfd', 'Type B', 'dfgdfgdfgfdgdfgdfgdfgdfgfdgdfgdfgdfgdfgdfgdgdffgdfgfdgdfgd', 1, 'dfgdfgdfg', 'dfgdfgdfg', 12, 'Low', 'Major', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(44, 'asdasdasdasdas', 'Type B', 'asdasdasdhjbsdhjhfghjhjfdjksdflfhkjsdghfvdshfdshfsdghjkgkjl;', 1, 'asdasdfsfdsf', 'sdfsdfsdf', 12, 'Moderate', 'Major', 'Approve Reject', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(45, 'No output 222', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(46, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(47, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(48, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Closed', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(49, 'No output edit screenshot test', 'Type C', '&&&&&var express = require(''express'');dsfhejgabk.tgbjeg v \r\nvar bodyParser = require(''body-parser'');\r\nvar mysql = require(''mysql''); {}sfdbgrjgf,hurtg64305465wejfedf7f\r\nvar cors = require(''cors'');{}fjlsgujbhrwgcfylefrgbj.cxblewfr\r\nvar jwt = require(''jsonwebtoken'');\r\nvar cookieparser = require(''cookie-parser'');\r\nvar val = require(''validator''); &&&&&', 1, 'app.js', '&&', -1236, 'High', 'Major', 'Open', 2, NULL, NULL, 'ironman_mark07_avengers-wallpaper-1366x7681485771265003.jpg', '2017-01-28'),
(50, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Minor', 'Open', 2, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(51, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(52, 'No output edit edit edit', 'Type C', ' Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ', 1, 'File', 'Ok', 56, 'High', 'Critical', 'Open', 2, NULL, NULL, '221485330547466.png', '2017-01-28'),
(53, 'No output 22', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 9, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(54, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(55, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(56, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(57, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 5, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(62, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(63, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(64, 'File upload', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 3, NULL, 'IMG_20161216_1529471485177328433.jpg', '2017-01-28'),
(65, 'Screenshot test', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11, NULL, 'Bug Details1485246924742.png', '2017-01-28'),
(66, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 3, NULL, 'noscreen21.png', '2017-01-28'),
(67, 'New bug', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11, NULL, '71485260217072.png', '2017-01-28'),
(68, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 9, NULL, 'nimish1485260468654.png', '2017-01-28'),
(70, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_1529471485329454084.jpg', '2017-01-28'),
(71, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_1557281485329487189.jpg', '2017-01-28'),
(72, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 3, 'modal.find(''#devResult'').append', 'IMG_20161216_155703(1)1485329497312.jpg', '2017-01-28'),
(73, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Approval', 2, 3, NULL, 'IMG_20161216_1530391485329505517.jpg', '2017-01-28'),
(74, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Closed', 2, 3, 'Test reason', '51485329517343.png', '2017-01-28'),
(75, 'Error Ranjith', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 10, 'File', 'Ok', 56, 'High', 'Major', 'Approval', 17, 18, NULL, '171485333792347.png', '2017-01-28'),
(77, 'Screenshot test 1', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-28'),
(78, '&&&&name&&&&', 'Type C', ' var express = require(''express'');\r\nvar bodyParser = require(''body-parser'');\r\nvar mysql = require(''mysql'');\r\nvar cors = require(''cors'');\r\nvar jwt = require(''jsonwebtoken'');\r\nvar cookieparser = require(''cookie-parser'');\r\nvar val = require(''validator'');hfdfh,sffgjrk.bg.rasdabjglreaghrjfg mkcxsdvZgknelwaf/ihretuert8473052042-1\r\nl{} ', 1, 'main.js', '&&', -987, 'High', 'Major', 'Open', 2, NULL, NULL, 'ironman_mark07_avengers-wallpaper-1366x7681485772675901.jpg', '2017-01-28'),
(80, 'CEK Bug Edit', 'Type B', ' Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum  ', 30, 'server.js', 'aasdasd', 12, 'Low', 'Minor', 'Closed', 26, 25, 'Not fixed 2', 'noscreen21.png', '2017-01-28'),
(81, 'Date test', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-28'),
(82, 'No output date', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-28'),
(83, 'No output date 2', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'IMG_20161216_155728(1)1485841208725.jpg', '2017-01-28'),
(84, 'No output date 3', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 9, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-28'),
(85, 'No output date 4 edit', 'Type C', ' Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ', 9, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-31'),
(86, 'Remove user test bug', 'Type B', 'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description ', 10, 'server.js', 'getDetails()', 12, 'Low', 'Minor', 'Open', 2, NULL, NULL, 'noscreen21.png', '2017-01-31');

-- --------------------------------------------------------

--
-- Table structure for table `password_change_requests`
--

CREATE TABLE IF NOT EXISTS `password_change_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` varchar(200) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `flag` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `password_change_requests`
--

INSERT INTO `password_change_requests` (`id`, `request_id`, `employee_id`, `time`, `flag`) VALUES
(1, '9a20944b8f89d0457b86d9d39544020f', 514, '2017-02-01 08:04:14', 0),
(2, 'fd20e0bf2c5ea84f00be0c016df970bf', 514, '2017-02-01 08:06:14', 0),
(3, '7c202974f202772e5773aed412d12e19', 514, '2017-02-01 09:29:05', 0),
(4, '1094d129abd37bb4c208289cc85140f6', 514, '2017-02-01 09:30:53', 0),
(5, '8b75a449f3e1800eb6aff11d5082511e', 512, '2017-02-01 09:55:17', 0),
(6, 'd0807f4d7414e34206c1762703e3f820', 512, '2017-02-01 09:56:41', 0),
(7, 'cb9555342434ed579cfa2aba181152e2', 512, '2017-02-01 10:53:59', 0),
(8, '28309e676809139444547d9cd71eeaf4', 512, '2017-02-01 10:54:53', 0);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Open',
  PRIMARY KEY (`id`),
  KEY `manager_id` (`manager_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `manager_id`, `status`) VALUES
(1, 'FieldMax', 1, 'Open'),
(2, 'Xport', 12, 'Open'),
(9, 'Test', 1, 'Open'),
(10, 'Tennis 360', 1, 'Open'),
(30, 'College of Engineering Kidangoor', 1, 'Closed');

-- --------------------------------------------------------

--
-- Table structure for table `project_team`
--

CREATE TABLE IF NOT EXISTS `project_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id_2` (`project_id`,`user_id`),
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=142 ;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`id`, `project_id`, `user_id`) VALUES
(122, 1, 2),
(113, 1, 3),
(123, 1, 4),
(114, 1, 5),
(111, 1, 9),
(112, 1, 11),
(30, 2, 3),
(9, 2, 8),
(10, 2, 9),
(107, 9, 2),
(109, 9, 3),
(108, 9, 4),
(110, 9, 5),
(141, 10, 2),
(115, 10, 17),
(117, 10, 18),
(139, 10, 30),
(140, 10, 31),
(138, 30, 25),
(137, 30, 26);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `class` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL DEFAULT 'example@example.com',
  `flag` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `class`, `name`, `email`, `flag`) VALUES
(1, 511, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin', 'nimish.mathew@experionglobal.com', 1),
(2, 512, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester', 'nimish.mathew@experionglobal.com', 1),
(3, 513, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer', 'nimish.mathew@experionglobal.com', 1),
(4, 514, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 2', 'nimish.mathew@experionglobal.com', 1),
(5, 515, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 2', 'nimish.mathew@experionglobal.com', 1),
(8, 516, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 3', 'nimish.mathew@experionglobal.com', 1),
(9, 517, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 3', 'nimish.mathew@experionglobal.com', 1),
(10, 518, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 4', 'nimish.mathew@experionglobal.com', 1),
(11, 519, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 4', 'nimish.mathew@experionglobal.com', 1),
(12, 520, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin 2', 'nimish.mathew@experionglobal.com', 1),
(13, 521, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin 3', 'nimish.mathew@experionglobal.com', 1),
(14, 522, '32250170a0dca92d53ec9624f336ca24', 0, 'Nimish', 'nimish.mathew@experionglobal.com', 1),
(15, 530, 'd05f527a80178c328fb23af0326f9190', 0, 'Nimish', 'nimishdavid@gmail.com', 0),
(16, 531, 'd05f527a80178c328fb23af0326f9190', 0, 'Ranjith', 'nimishdavid@gmail.com', 1),
(17, 540, 'd05f527a80178c328fb23af0326f9190', 1, 'Ranjith Bhat', 'nimish.mathew@experionglobal.com', 1),
(18, 541, 'd05f527a80178c328fb23af0326f9190', 2, 'Sajith V', 'nimish.mathew@experionglobal.com', 1),
(23, 555, 'ec0e2603172c73a8b644bb9456c1ff6e', 0, 'Batman', 'batman@gothamcity.com', 0),
(25, 600, 'd05f527a80178c328fb23af0326f9190', 2, 'Justin Joseph', 'nimish.mathew@experionglobal.com', 0),
(26, 601, '32250170a0dca92d53ec9624f336ca24', 1, 'Jacob Jose', 'nimish.mathew@experionglobal.com', 0),
(27, 560, 'a8f5f167f44f4964e6c998dee827110c', 2, 'xcbgcfbh', 'asdasd@aslfhskdj.com', 0),
(28, 321, 'a8f5f167f44f4964e6c998dee827110c', 2, 'nimish david', 'asdas@sadabsh.com', 0),
(29, 111, '32250170a0dca92d53ec9624f336ca24', 0, 'Superman', 'superman@gmail.com', 0),
(30, 666, '32250170a0dca92d53ec9624f336ca24', 1, 'Tibin', 'tibin@sdkljfkdsl.com', 0),
(31, 550, '32250170a0dca92d53ec9624f336ca24', 2, 'Tibin', 'tibin@dlkfvdlk.com', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bugs`
--
ALTER TABLE `bugs`
  ADD CONSTRAINT `bugs_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bugs_ibfk_2` FOREIGN KEY (`developer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bugs_ibfk_3` FOREIGN KEY (`tester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `project_team`
--
ALTER TABLE `project_team`
  ADD CONSTRAINT `project_team_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_team_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
