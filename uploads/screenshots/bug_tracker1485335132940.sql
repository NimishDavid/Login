-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 16, 2017 at 06:40 PM
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
  `description` varchar(200) NOT NULL,
  `project_id` int(11) NOT NULL,
  `file` varchar(100) NOT NULL,
  `method` varchar(100) NOT NULL,
  `line` int(11) DEFAULT NULL,
  `priority` varchar(20) NOT NULL,
  `severity` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `tester_id` int(11) NOT NULL,
  `developer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `developer_id` (`developer_id`),
  KEY `tester_id` (`tester_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `bugs`
--

INSERT INTO `bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `tester_id`, `developer_id`) VALUES
(24, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Closed', 4, 3),
(25, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Resolving', 4, 5),
(26, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Resolving', 4, 3),
(27, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 3),
(28, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Closed', 2, 5),
(29, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Assigned', 2, 3),
(30, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 8, 9),
(31, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Assigned', 8, 11),
(32, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Assigned', 8, 9),
(33, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Open', 10, NULL),
(34, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Open', 10, NULL),
(35, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Open', 10, NULL),
(36, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 4, NULL),
(37, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Open', 4, NULL),
(38, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Open', 4, NULL),
(39, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL),
(40, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Open', 2, NULL),
(41, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Open', 2, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `manager_id`, `status`) VALUES
(1, 'FieldMax', 1, 'Open'),
(2, 'Xport', 12, 'Open');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`id`, `project_id`, `user_id`) VALUES
(6, 1, 3),
(8, 1, 5),
(27, 1, 8),
(30, 2, 3),
(9, 2, 8),
(10, 2, 9);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `class` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `class`, `name`) VALUES
(1, 511, 'pass123', 0, 'Admin'),
(2, 512, 'pass123', 1, 'Tester'),
(3, 513, 'pass123', 2, 'Developer'),
(4, 514, 'pass123', 1, 'Tester 2'),
(5, 515, 'pass123', 2, 'Developer 2'),
(8, 516, 'pass123', 1, 'Tester 3'),
(9, 517, 'pass123', 2, 'Developer 3'),
(10, 518, 'pass123', 1, 'Tester 4'),
(11, 519, 'pass123', 2, 'Developer 4'),
(12, 520, 'pass123', 0, 'Admin 2'),
(13, 521, 'pass123', 0, 'Admin 3');

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
