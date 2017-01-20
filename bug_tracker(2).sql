-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 20, 2017 at 02:08 PM
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
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `developer_id` (`developer_id`),
  KEY `tester_id` (`tester_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=58 ;

--
-- Dumping data for table `bugs`
--

INSERT INTO `bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `tester_id`, `developer_id`) VALUES
(24, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Closed', 4, 3),
(25, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Resolving', 4, 5),
(26, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 4, 3),
(27, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Resolving', 2, 3),
(28, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Closed', 2, 5),
(29, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 2, 3),
(30, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 8, 9),
(31, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Assigned', 8, 11),
(32, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Assigned', 8, 9),
(33, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'File', 'Ok', 56, 'High', 'Major', 'Resolving', 10, 3),
(34, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Critical', 'Open', 10, NULL),
(35, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 2, 'Files', 'Ok', 56, 'Low', 'Major', 'Open', 10, NULL),
(36, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review', 4, 3),
(37, 'No display', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Review', 4, 3),
(38, 'No input', 'Type A', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'Files', 'Ok', 56, 'Low', 'Major', 'Review', 4, 3),
(39, 'AJAX error 3', 'Type B', '  Nimish David Mathew Kottummel Thrayil House Vakkadu P.O 2 ', 1, 'File2', 'Ok2', 562, 'High', 'Minor', 'Closed', 2, 3),
(40, 'No display in', 'Type B', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O  ', 1, 'Files', 'Ok', 56, 'Low', 'Critical', 'Assigned', 2, 11),
(41, 'No input ok', 'Type C', ' Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ok', 1, 'Files ok', 'Ok ok', 560, 'Moderate', 'Critical', 'Assigned', 2, 11),
(42, 'sdasdfdsfsdfsdfds', 'Type B', 'asdasdasdasdasdasdsadasdasdasdasdasdasdasdasdasdadas ', 1, 'okokokoko', 'okokoko', 1, 'Moderate', 'Minor', 'Assigned', 2, 11),
(43, 'sdffgdsgfd', 'Type B', 'dfgdfgdfgfdgdfgdfgdfgdfgfdgdfgdfgdfgdfgdfgdgdffgdfgfdgdfgd', 1, 'dfgdfgdfg', 'dfgdfgdfg', 12, 'Low', 'Major', 'Assigned', 2, 11),
(44, 'asdasdasdasdas', 'Type B', 'asdasdasdhjbsdhjhfghjhjfdjksdflfhkjsdghfvdshfdshfsdghjkgkjl;', 1, 'asdasdfsfdsf', 'sdfsdfsdf', 12, 'Moderate', 'Major', 'Approve Reject', 2, 11),
(45, 'No output 222', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O ', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11),
(46, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11),
(47, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review Reject', 2, 11),
(48, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Review', 2, 11),
(49, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL),
(50, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Minor', 'Open', 2, NULL),
(51, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL),
(52, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Critical', 'Open', 2, NULL),
(53, 'No output 22', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL),
(54, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11),
(55, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11),
(56, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Assigned', 2, 11),
(57, 'No output', 'Type C', 'Nimish David Mathew Kottummel Thrayil House Vakkadu P.O', 1, 'File', 'Ok', 56, 'High', 'Major', 'Open', 2, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `manager_id`, `status`) VALUES
(1, 'FieldMax', 1, 'Open'),
(2, 'Xport', 12, 'Open'),
(3, 'fgsdgdg', 1, 'Closed'),
(4, 'sdfsdfsdfsd', 1, 'Closed'),
(5, 'cvsxdfgvdfgfd', 1, 'Closed');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=92 ;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`id`, `project_id`, `user_id`) VALUES
(84, 1, 2),
(88, 1, 3),
(85, 1, 4),
(89, 1, 5),
(90, 1, 9),
(91, 1, 11),
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
  `password` varchar(50) NOT NULL,
  `class` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL DEFAULT 'example@example.com',
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `class`, `name`, `email`) VALUES
(1, 511, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin', 'nimish.mathew@experionglobal.com'),
(2, 512, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester', 'nimish.mathew@experionglobal.com'),
(3, 513, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer', 'nimish.mathew@experionglobal.com'),
(4, 514, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 2', 'nimish.mathew@experionglobal.com'),
(5, 515, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 2', 'nimish.mathew@experionglobal.com'),
(8, 516, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 3', 'nimish.mathew@experionglobal.com'),
(9, 517, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 3', 'nimish.mathew@experionglobal.com'),
(10, 518, '32250170a0dca92d53ec9624f336ca24', 1, 'Tester 4', 'nimish.mathew@experionglobal.com'),
(11, 519, '32250170a0dca92d53ec9624f336ca24', 2, 'Developer 4', 'nimish.mathew@experionglobal.com'),
(12, 520, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin 2', 'nimish.mathew@experionglobal.com'),
(13, 521, '32250170a0dca92d53ec9624f336ca24', 0, 'Admin 3', 'nimish.mathew@experionglobal.com'),
(14, 522, '32250170a0dca92d53ec9624f336ca24', 0, 'Nimish', 'nimish.mathew@experionglobal.com');

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
