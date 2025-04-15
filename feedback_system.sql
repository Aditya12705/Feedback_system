CREATE DATABASE  IF NOT EXISTS `feedback_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `feedback_system`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: feedback_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseName` varchar(255) NOT NULL,
  `facultyName` varchar(255) NOT NULL,
  `subjectName` varchar(255) NOT NULL,
  `semester` int NOT NULL,
  `isElective` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_courses_courseName` (`courseName`),
  KEY `idx_courses_semester` (`semester`),
  CONSTRAINT `courses_chk_1` CHECK ((`semester` between 1 and 8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `courseName` varchar(255) DEFAULT NULL,
  `subjectName` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `professorName` varchar(255) DEFAULT NULL,
  `subjectCode` varchar(255) DEFAULT NULL,
  `academicYear` varchar(255) DEFAULT NULL,
  `isElective` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_faculties_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,'Dr. Senthil Kumar. P','Optimization Technique','B.Tech CSE','Optimization Technique','2nd Semester','Dr. Senthil Kumar. P','MAT1002','2023-2024',0),(2,'Dr. Lokesha.H.S','Applied Statistics','B.Tech CSE','Applied Statistics','2nd Semester','Dr. Lokesha.H.S','MAT1003','2023-2024',0),(3,'Dr. Chandrashekar B. N','Programming in Java','B.Tech CSE','Programming in Java','2nd Semester','Dr. Chandrashekar B. N','CSE1002','2023-2024',0),(4,'Dr. Rajat','Data Structures and Algorithms','B.Tech CSE','Data Structures and Algorithms','2nd Semester','Dr. Rajat','CSE2001','2023-2024',0),(5,'Dr. Arshpreet Kaur','Web Technology','B.Tech CSE','Web Technology','2nd Semester','Dr. Arshpreet Kaur','CSE2002','2023-2024',0),(6,'Dr. Ravi','Numerical Methods','B.Tech CSE','Numerical Methods','2nd Semester','Dr. Ravi','MAT1004','2023-2024',0),(7,'Dr. Jeyavelu.S','Digital Entrepreneurship','B.Tech CSE','Digital Entrepreneurship','2nd Semester','Dr. Jeyavelu.S','MGT1002','2023-2024',0),(8,'Dr. Nagabhushan K.R','Introduction to Nano Science & Nano Technology','B.Tech CSE','Introduction to Nano Science & Nano Technology','2nd Semester','Dr. Nagabhushan K.R','PHY2001','2023-2024',0),(9,'Dr. Amita Somya','Introduction to Nano Technology','B.Tech CSE','Introduction to Nano Technology','2nd Semester','Dr. Amita Somya','CHE1001','2023-2024',0),(10,'Dr. Ashok Babu','Communication Kannada','B.Tech CSE','Communication Kannada','2nd Semester','Dr. Ashok Babu','KAN1003','2023-2024',0),(11,'Ms. Yamini Vij','Communicative French','B.Tech CSE','Communicative French','2nd Semester','Ms. Yamini Vij','FRE1002','2023-2024',0),(12,'Dr. Madhavi G.M','Professional English','B.Tech CSE','Professional English','2nd Semester','Dr. Madhavi G.M','ENG1002','2023-2024',0),(13,'Dr. Varshini','Dynamics of Human Behaviour','B.Tech CSE','Dynamics of Human Behaviour','2nd Semester','Dr. Varshini','PSY1002','2023-2024',0),(14,'Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','Minor Track Courses - MM / ME / SP','B.Tech CSE','Minor Track Courses - MM / ME / SP','2nd Semester','Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','MGT1003','2023-2024',1),(15,'Dr. Punam Kumari','Introduction to C – Programming','B.Tech CSE','Introduction to C – Programming','1st Semester','Dr. Punam Kumari',NULL,'2023-2024',0),(16,'Dr. Nagabhushana K R','Engineering Physics','B.Tech CSE','Engineering Physics','1st Semester','Dr. Nagabhushana K R',NULL,'2023-2024',0),(17,'Dr. P. Senthil Kumar','Mathematics – 1','B.Tech CSE','Mathematics – 1','1st Semester','Dr. P. Senthil Kumar',NULL,'2023-2024',0),(18,'Dr. Amita Somya','Environmental Studies','B.Tech CSE','Environmental Studies','1st Semester','Dr. Amita Somya',NULL,'2023-2024',0),(19,'Dr. Madhavi G M','English for Communication – 1','B.Tech CSE','English for Communication – 1','1st Semester','Dr. Madhavi G M',NULL,'2023-2024',0),(20,'Dr. Misbah Hassan','Understanding Self for Effectiveness','B.Tech CSE','Understanding Self for Effectiveness','1st Semester','Dr. Misbah Hassan',NULL,'2023-2024',0),(21,'Dr. Ashokbabu','Basic / Advanced Kannada','B.Tech CSE','Basic / Advanced Kannada','1st Semester','Dr. Ashokbabu',NULL,'2023-2024',0),(22,'Ms. Yamini Vij','French for Technology - 1','B.Tech CSE','French for Technology - 1','1st Semester','Ms. Yamini Vij',NULL,'2023-2024',0),(23,'Dr. S. Jeyavelu / Ms. Varshini S','Minor Track - BM / Psy','B.Tech CSE','Minor Track - BM / Psy','1st Semester','Dr. S. Jeyavelu / Ms. Varshini S',NULL,'2023-2024',1),(24,'Dr. Senthil Kumar. P','Optimization Technique','B.Tech AIML','Optimization Technique','2nd Semester','Dr. Senthil Kumar. P','MAT1002','2023-2024',0),(25,'Dr. Lokesha.H.S','Applied Statistics','B.Tech AIML','Applied Statistics','2nd Semester','Dr. Lokesha.H.S','MAT1003','2023-2024',0),(26,'Dr. Chandrashekar B. N','Programming in Java','B.Tech AIML','Programming in Java','2nd Semester','Dr. Chandrashekar B. N','CSE1002','2023-2024',0),(27,'Dr. Rajat','Data Structures and Algorithms','B.Tech AIML','Data Structures and Algorithms','2nd Semester','Dr. Rajat','CSE2001','2023-2024',0),(28,'Dr. Arshpreet Kaur','Web Technology','B.Tech AIML','Web Technology','2nd Semester','Dr. Arshpreet Kaur','CSE2002','2023-2024',0),(29,'Dr. Ravi','Numerical Methods','B.Tech AIML','Numerical Methods','2nd Semester','Dr. Ravi','MAT1004','2023-2024',0),(30,'Dr. Jeyavelu.S','Digital Entrepreneurship','B.Tech AIML','Digital Entrepreneurship','2nd Semester','Dr. Jeyavelu.S','MGT1002','2023-2024',0),(31,'Dr. Nagabhushan K.R','Introduction to Nano Science & Nano Technology','B.Tech AIML','Introduction to Nano Science & Nano Technology','2nd Semester','Dr. Nagabhushan K.R','PHY2001','2023-2024',0),(32,'Dr. Amita Somya','Introduction to Nano Technology','B.Tech AIML','Introduction to Nano Technology','2nd Semester','Dr. Amita Somya','CHE1001','2023-2024',0),(33,'Dr. Ashok Babu','Communication Kannada','B.Tech AIML','Communication Kannada','2nd Semester','Dr. Ashok Babu','FRE1002','2023-2024',0),(34,'Ms. Yamini Vij','Communicative French','B.Tech AIML','Communicative French','2nd Semester','Ms. Yamini Vij','KAN1003','2023-2024',0),(35,'Dr. Madhavi G.M','Professional English','B.Tech AIML','Professional English','2nd Semester','Dr. Madhavi G.M','ENG1002','2023-2024',0),(36,'Dr. Varshini','Dynamics of Human Behaviour','B.Tech AIML','Dynamics of Human Behaviour','2nd Semester','Dr. Varshini','PSY1002','2023-2024',0),(37,'Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','Minor Track Courses - MM / ME / SP','B.Tech AIML','Minor Track Courses - MM / ME / SP','2nd Semester','Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan',NULL,'2023-2024',1),(38,'Dr. Rajat Bhardwaj','Introduction to C – Programming','B.Tech AIML','Introduction to C – Programming','1st Semester','Dr. Rajat Bhardwaj',NULL,'2023-2024',0),(39,'Dr. Nagabhushana K R','Engineering Physics','B.Tech AIML','Engineering Physics','1st Semester','Dr. Nagabhushana K R',NULL,'2023-2024',0),(40,'Dr. Amita Somya','Environmental Studies','B.Tech AIML','Environmental Studies','1st Semester','Dr. Amita Somya',NULL,'2023-2024',0),(41,'Dr. Madhavi G M','English for Communication – 1','B.Tech AIML','English for Communication – 1','1st Semester','Dr. Madhavi G M',NULL,'2023-2024',0),(42,'Dr. Misbah Hassan','Understanding Self for Effectiveness','B.Tech AIML','Understanding Self for Effectiveness','1st Semester','Dr. Misbah Hassan',NULL,'2023-2024',0),(43,'Dr. Ashokbabu','Basic/Advanced Kannada','B.Tech AIML','Basic/Advanced Kannada','1st Semester','Dr. Ashokbabu',NULL,'2023-2024',0),(44,'Ms. Yamini Vij','French for Technology - 1','B.Tech AIML','French for Technology - 1','1st Semester','Ms. Yamini Vij',NULL,'2023-2024',0),(45,'Dr. S. Jeyavelu / Ms. Varshini S','Minor Track Courses - BM / Psy','B.Tech AIML','Minor Track Courses - BM / Psy','1st Semester','Dr. S. Jeyavelu / Ms. Varshini S',NULL,'2023-2024',1),(46,'Dr. P. Senthil Kumar','Mathematics – 1','B.Tech AIML','Mathematics – 1','1st Semester','Dr. P. Senthil Kumar',NULL,'2023-2024',0);
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties_backup`
--

DROP TABLE IF EXISTS `faculties_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties_backup` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `courseName` varchar(255) DEFAULT NULL,
  `subjectName` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `professorName` varchar(255) DEFAULT NULL,
  `subjectCode` varchar(255) DEFAULT NULL,
  `academicYear` varchar(255) DEFAULT NULL,
  `isElective` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties_backup`
--

LOCK TABLES `faculties_backup` WRITE;
/*!40000 ALTER TABLE `faculties_backup` DISABLE KEYS */;
INSERT INTO `faculties_backup` VALUES (1,'Dr. Senthil Kumar. P','Optimization Technique','B.Tech CSE','Optimization Technique','2nd Semester','Dr. Senthil Kumar. P','MAT1002','2023-2024',0),(2,'Dr. Lokesha.H.S','Applied Statistics','B.Tech CSE','Applied Statistics','2nd Semester','Dr. Lokesha.H.S','MAT1003','2023-2024',0),(3,'Dr. Chandrashekar B. N','Programming in Java','B.Tech CSE','Programming in Java','2nd Semester','Dr. Chandrashekar B. N','CSE1002','2023-2024',0),(4,'Dr. Rajat','Data Structures and Algorithms','B.Tech CSE','Data Structures and Algorithms','2nd Semester','Dr. Rajat','CSE2001','2023-2024',0),(5,'Dr. Arshpreet Kaur','Web Technology','B.Tech CSE','Web Technology','2nd Semester','Dr. Arshpreet Kaur','CSE2002','2023-2024',0),(6,'Dr. Ravi','Numerical Methods','B.Tech CSE','Numerical Methods','2nd Semester','Dr. Ravi','MAT1004','2023-2024',0),(7,'Dr. Jeyavelu.S','Digital Entrepreneurship','B.Tech CSE','Digital Entrepreneurship','2nd Semester','Dr. Jeyavelu.S','MGT1002','2023-2024',0),(8,'Dr. Nagabhushan K.R','Introduction to Nano Science & Nano Technology','B.Tech CSE','Introduction to Nano Science & Nano Technology','2nd Semester','Dr. Nagabhushan K.R','PHY2001','2023-2024',0),(9,'Dr. Amita Somya','Introduction to Nano Technology','B.Tech CSE','Introduction to Nano Technology','2nd Semester','Dr. Amita Somya','CHE1001','2023-2024',0),(10,'Dr. Ashok Babu','Communication Kannada','B.Tech CSE','Communication Kannada','2nd Semester','Dr. Ashok Babu','KAN1003','2023-2024',0),(11,'Ms. Yamini Vij','Communicative French','B.Tech CSE','Communicative French','2nd Semester','Ms. Yamini Vij','FRE1002','2023-2024',0),(12,'Dr. Madhavi G.M','Professional English','B.Tech CSE','Professional English','2nd Semester','Dr. Madhavi G.M','ENG1002','2023-2024',0),(13,'Dr. Varshini','Dynamics of Human Behaviour','B.Tech CSE','Dynamics of Human Behaviour','2nd Semester','Dr. Varshini','PSY1002','2023-2024',0),(14,'Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','Minor Track Courses - MM / ME / SP','B.Tech CSE','Minor Track Courses - MM / ME / SP','2nd Semester','Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','MGT1003','2023-2024',1),(15,'Dr. Punam Kumari','Introduction to C – Programming','B.Tech CSE','Introduction to C – Programming','1st Semester','Dr. Punam Kumari',NULL,'2023-2024',0),(16,'Dr. Nagabhushana K R','Engineering Physics','B.Tech CSE','Engineering Physics','1st Semester','Dr. Nagabhushana K R',NULL,'2023-2024',0),(17,'Dr. P. Senthil Kumar','Mathematics – 1','B.Tech CSE','Mathematics – 1','1st Semester','Dr. P. Senthil Kumar',NULL,'2023-2024',0),(18,'Dr. Amita Somya','Environmental Studies','B.Tech CSE','Environmental Studies','1st Semester','Dr. Amita Somya',NULL,'2023-2024',0),(19,'Dr. Madhavi G M','English for Communication – 1','B.Tech CSE','English for Communication – 1','1st Semester','Dr. Madhavi G M',NULL,'2023-2024',0),(20,'Dr. Misbah Hassan','Understanding Self for Effectiveness','B.Tech CSE','Understanding Self for Effectiveness','1st Semester','Dr. Misbah Hassan',NULL,'2023-2024',0),(21,'Dr. Ashokbabu','Basic / Advanced Kannada','B.Tech CSE','Basic / Advanced Kannada','1st Semester','Dr. Ashokbabu',NULL,'2023-2024',0),(22,'Ms. Yamini Vij','French for Technology - 1','B.Tech CSE','French for Technology - 1','1st Semester','Ms. Yamini Vij',NULL,'2023-2024',0),(23,'Dr. S. Jeyavelu / Ms. Varshini S','Minor Track - BM / Psy','B.Tech CSE','Minor Track - BM / Psy','1st Semester','Dr. S. Jeyavelu / Ms. Varshini S',NULL,'2023-2024',1),(24,'Dr. Senthil Kumar. P','Optimization Technique','B.Tech AIML','Optimization Technique','2nd Semester','Dr. Senthil Kumar. P','MAT1002','2023-2024',0),(25,'Dr. Lokesha.H.S','Applied Statistics','B.Tech AIML','Applied Statistics','2nd Semester','Dr. Lokesha.H.S','MAT1003','2023-2024',0),(26,'Dr. Chandrashekar B. N','Programming in Java','B.Tech AIML','Programming in Java','2nd Semester','Dr. Chandrashekar B. N','CSE1002','2023-2024',0),(27,'Dr. Rajat','Data Structures and Algorithms','B.Tech AIML','Data Structures and Algorithms','2nd Semester','Dr. Rajat','CSE2001','2023-2024',0),(28,'Dr. Arshpreet Kaur','Web Technology','B.Tech AIML','Web Technology','2nd Semester','Dr. Arshpreet Kaur','CSE2002','2023-2024',0),(29,'Dr. Ravi','Numerical Methods','B.Tech AIML','Numerical Methods','2nd Semester','Dr. Ravi','MAT1004','2023-2024',0),(30,'Dr. Jeyavelu.S','Digital Entrepreneurship','B.Tech AIML','Digital Entrepreneurship','2nd Semester','Dr. Jeyavelu.S','MGT1002','2023-2024',0),(31,'Dr. Nagabhushan K.R','Introduction to Nano Science & Nano Technology','B.Tech AIML','Introduction to Nano Science & Nano Technology','2nd Semester','Dr. Nagabhushan K.R','PHY2001','2023-2024',0),(32,'Dr. Amita Somya','Introduction to Nano Technology','B.Tech AIML','Introduction to Nano Technology','2nd Semester','Dr. Amita Somya','CHE1001','2023-2024',0),(33,'Dr. Ashok Babu','Communication Kannada','B.Tech AIML','Communication Kannada','2nd Semester','Dr. Ashok Babu','FRE1002','2023-2024',0),(34,'Ms. Yamini Vij','Communicative French','B.Tech AIML','Communicative French','2nd Semester','Ms. Yamini Vij','KAN1003','2023-2024',0),(35,'Dr. Madhavi G.M','Professional English','B.Tech AIML','Professional English','2nd Semester','Dr. Madhavi G.M','ENG1002','2023-2024',0),(36,'Dr. Varshini','Dynamics of Human Behaviour','B.Tech AIML','Dynamics of Human Behaviour','2nd Semester','Dr. Varshini','PSY1002','2023-2024',0),(37,'Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan','Minor Track Courses - MM / ME / SP','B.Tech AIML','Minor Track Courses - MM / ME / SP','2nd Semester','Dr. Raksha / Dr. Shreya / Dr. Mishbah Hasan',NULL,'2023-2024',1),(38,'Dr. Rajat Bhardwaj','Introduction to C – Programming','B.Tech AIML','Introduction to C – Programming','1st Semester','Dr. Rajat Bhardwaj',NULL,'2023-2024',0),(39,'Dr. Nagabhushana K R','Engineering Physics','B.Tech AIML','Engineering Physics','1st Semester','Dr. Nagabhushana K R',NULL,'2023-2024',0),(40,'Dr. Amita Somya','Environmental Studies','B.Tech AIML','Environmental Studies','1st Semester','Dr. Amita Somya',NULL,'2023-2024',0),(41,'Dr. Madhavi G M','English for Communication – 1','B.Tech AIML','English for Communication – 1','1st Semester','Dr. Madhavi G M',NULL,'2023-2024',0),(42,'Dr. Misbah Hassan','Understanding Self for Effectiveness','B.Tech AIML','Understanding Self for Effectiveness','1st Semester','Dr. Misbah Hassan',NULL,'2023-2024',0),(43,'Dr. Ashokbabu','Basic/Advanced Kannada','B.Tech AIML','Basic/Advanced Kannada','1st Semester','Dr. Ashokbabu',NULL,'2023-2024',0),(44,'Ms. Yamini Vij','French for Technology - 1','B.Tech AIML','French for Technology - 1','1st Semester','Ms. Yamini Vij',NULL,'2023-2024',0),(45,'Dr. S. Jeyavelu / Ms. Varshini S','Minor Track Courses - BM / Psy','B.Tech AIML','Minor Track Courses - BM / Psy','1st Semester','Dr. S. Jeyavelu / Ms. Varshini S',NULL,'2023-2024',1),(46,'Dr. P. Senthil Kumar','Mathematics – 1','B.Tech AIML','Mathematics – 1','1st Semester','Dr. P. Senthil Kumar',NULL,'2023-2024',0);
/*!40000 ALTER TABLE `faculties_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty_id`
--

DROP TABLE IF EXISTS `faculty_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_id` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty_id`
--

LOCK TABLES `faculty_id` WRITE;
/*!40000 ALTER TABLE `faculty_id` DISABLE KEYS */;
/*!40000 ALTER TABLE `faculty_id` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `feedbackType` varchar(255) DEFAULT NULL,
  `courseName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'The faculty clearly outlines & explains the Course Objective, Session Plan & Evaluation Scheme on the first day of the class.','Pre-Feedback',NULL),(2,'The course design is comprehensive, relevant & well structured.','Pre-Feedback',NULL),(3,'Session Plan is evenly covering the whole syllabus.','Pre-Feedback',NULL),(4,'The faculty gives an updated list of study reference i.e. textbooks / journals / magazines etc.','Pre-Feedback',NULL),(5,'Lectures / Labs / Tutorials are conducted as per the schedule / session plan.','Pre-Feedback',NULL),(6,'The faculty comes well prepared in the class.','Pre-Feedback',NULL),(7,'The faculty way of teaching is clear & understandable to the students.','Pre-Feedback',NULL),(8,'The faculty uses innovative ways of teaching e.g., Power Point Presentation, Class Discussions, Slide Presentations etc.','Pre-Feedback',NULL),(9,'The course actually covered matches with the session plan given initially.','Pre-Feedback',NULL),(10,'The faculty allows students to express their ideas freely.','Pre-Feedback',NULL),(11,'The faculty is available for academic help outside the classroom & effectively stimulates interest in the subject matter.','Pre-Feedback',NULL),(12,'The faculty gives adequate & relevant examples from the real world.','Pre-Feedback',NULL),(13,'Faculty helps in improving the understanding & application of the subject matter.','Pre-Feedback',NULL),(14,'The Assignments / Projects given are relevant & useful.','Pre-Feedback',NULL),(15,'Classroom activity stimulates searching for further material from different sources.','Pre-Feedback',NULL),(16,'Labs possess all the necessary software / testing materials / equipments.','Pre-Feedback',NULL),(17,'Field / Lab sessions are sufficient to cover the syllabus.','Pre-Feedback',NULL),(18,'The faculty provides outline of the continuous internal evaluation scheme in the first week of semester.','Pre-Feedback',NULL),(19,'The requirement of assignment / test and the means by which the students work is judged is clearly outlined for students both orally and in writing.','Pre-Feedback',NULL),(20,'The students are informed in a timely manner about their internal marks.','Pre-Feedback',NULL),(21,'Faculty provides feedback on the students’ performance in a timely manner.','Pre-Feedback',NULL),(22,'The faculty is well presentable & interactive.','Pre-Feedback',NULL),(23,'The faculty is fair, transparent, objective & just.','Pre-Feedback',NULL),(24,'The faculty effectively communicates and is audible.','Pre-Feedback',NULL),(25,'Faculty is aware and responsive to students’ learning difficulties.','Pre-Feedback',NULL),(26,'Would you like to do another course with this faculty or recommend this faculty to other students for doing the course?','Pre-Feedback',NULL),(101,'The faculty clearly outlines & explains the Course Objective, Session Plan & Evaluation Scheme on the first day of the class.','Post-Feedback',NULL),(102,'The course design is comprehensive, relevant & well structured.','Post-Feedback',NULL),(103,'Session Plan is evenly covering the whole syllabus.','Post-Feedback',NULL),(104,'The faculty gives an updated list of study reference i.e. textbooks / journals / magazines etc.','Post-Feedback',NULL),(105,'Lectures / labs / tutorials are conducted as per the schedule / session plan.','Post-Feedback',NULL),(106,'The faculty comes well prepared in the class.','Post-Feedback',NULL),(107,'The faculty way of teaching is clear & understandable to the students.','Post-Feedback',NULL),(108,'The faculty uses innovative ways of teaching e.g., Power Point Presentation, Class Discussions, Slide Presentations etc.','Post-Feedback',NULL),(109,'The course actually covered matches with the session plan given initially.','Post-Feedback',NULL),(110,'The faculty allows students to express their ideas freely.','Post-Feedback',NULL),(111,'The faculty is available for academic help outside the classroom & effectively stimulates interest in the subject matter.','Post-Feedback',NULL),(112,'The faculty gives adequate & relevant examples from the real world.','Post-Feedback',NULL),(113,'Faculty helps in improving the understanding & application of the subject matter.','Post-Feedback',NULL),(114,'The Assignments / Projects given are relevant & useful.','Post-Feedback',NULL),(115,'Classroom activity stimulates searching for further material from different sources.','Post-Feedback',NULL),(116,'The faculty provides outline of the continuous internal evaluation scheme in the first week of semester.','Post-Feedback',NULL),(117,'The faculty is well presentable & interactive.','Post-Feedback',NULL),(118,'The faculty is fair, transparent, objective & just.','Post-Feedback',NULL),(119,'The faculty effectively communicates and is audible.','Post-Feedback',NULL),(120,'Faculty is aware and responsive to students’ learning difficulties.','Post-Feedback',NULL),(121,'Has the faculty uploaded the session plan on the first day of the class?','Post-Feedback',NULL),(122,'Have the classes of the course commenced at the beginning of the semester?','Post-Feedback',NULL),(123,'Labs possess all the necessary software/testing materials/equipments.','Post-Feedback',NULL);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `faculty_id` int NOT NULL,
  `question_id` int NOT NULL,
  `score` int NOT NULL,
  `selected_faculty` varchar(255) DEFAULT NULL,
  `comment` text,
  `feedbackType` enum('Pre-Feedback','Post-Feedback','Trial') NOT NULL,
  `semester` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_scores_student_id` (`student_id`),
  KEY `idx_scores_faculty_id` (`faculty_id`),
  KEY `idx_scores_question_id` (`question_id`),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_chk_1` CHECK ((`score` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=704 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (236,'A86605223036',15,1,5,'','Bootiful','Pre-Feedback',1),(237,'A86605223036',15,2,4,'','Bootiful','Pre-Feedback',1),(238,'A86605223036',15,3,5,'','Bootiful','Pre-Feedback',1),(239,'A86605223036',15,4,2,'','Bootiful','Pre-Feedback',1),(240,'A86605223036',15,5,5,'','Bootiful','Pre-Feedback',1),(241,'A86605223036',15,6,2,'','Bootiful','Pre-Feedback',1),(242,'A86605223036',15,7,3,'','Bootiful','Pre-Feedback',1),(243,'A86605223036',15,8,3,'','Bootiful','Pre-Feedback',1),(244,'A86605223036',15,9,5,'','Bootiful','Pre-Feedback',1),(245,'A86605223036',15,10,3,'','Bootiful','Pre-Feedback',1),(246,'A86605223036',15,11,5,'','Bootiful','Pre-Feedback',1),(247,'A86605223036',15,12,5,'','Bootiful','Pre-Feedback',1),(248,'A86605223036',15,13,5,'','Bootiful','Pre-Feedback',1),(249,'A86605223036',15,14,4,'','Bootiful','Pre-Feedback',1),(250,'A86605223036',15,15,5,'','Bootiful','Pre-Feedback',1),(251,'A86605223036',15,16,2,'','Bootiful','Pre-Feedback',1),(252,'A86605223036',15,17,5,'','Bootiful','Pre-Feedback',1),(253,'A86605223036',15,18,3,'','Bootiful','Pre-Feedback',1),(254,'A86605223036',15,19,5,'','Bootiful','Pre-Feedback',1),(255,'A86605223036',15,20,4,'','Bootiful','Pre-Feedback',1),(256,'A86605223036',15,21,3,'','Bootiful','Pre-Feedback',1),(257,'A86605223036',15,22,2,'','Bootiful','Pre-Feedback',1),(258,'A86605223036',15,23,5,'','Bootiful','Pre-Feedback',1),(259,'A86605223036',15,24,5,'','Bootiful','Pre-Feedback',1),(260,'A86605223036',15,25,4,'','Bootiful','Pre-Feedback',1),(261,'A86605223036',15,26,5,'','Bootiful','Pre-Feedback',1),(262,'A86605223036',16,1,4,'','Bootiful','Pre-Feedback',1),(263,'A86605223036',16,2,2,'','Bootiful','Pre-Feedback',1),(264,'A86605223036',16,3,4,'','Bootiful','Pre-Feedback',1),(265,'A86605223036',16,4,3,'','Bootiful','Pre-Feedback',1),(266,'A86605223036',16,5,5,'','Bootiful','Pre-Feedback',1),(267,'A86605223036',16,6,3,'','Bootiful','Pre-Feedback',1),(268,'A86605223036',16,7,4,'','Bootiful','Pre-Feedback',1),(269,'A86605223036',16,8,4,'','Bootiful','Pre-Feedback',1),(270,'A86605223036',16,9,2,'','Bootiful','Pre-Feedback',1),(271,'A86605223036',16,10,4,'','Bootiful','Pre-Feedback',1),(272,'A86605223036',16,11,5,'','Bootiful','Pre-Feedback',1),(273,'A86605223036',16,12,3,'','Bootiful','Pre-Feedback',1),(274,'A86605223036',16,13,2,'','Bootiful','Pre-Feedback',1),(275,'A86605223036',16,14,5,'','Bootiful','Pre-Feedback',1),(276,'A86605223036',16,15,2,'','Bootiful','Pre-Feedback',1),(277,'A86605223036',16,16,5,'','Bootiful','Pre-Feedback',1),(278,'A86605223036',16,17,5,'','Bootiful','Pre-Feedback',1),(279,'A86605223036',16,18,5,'','Bootiful','Pre-Feedback',1),(280,'A86605223036',16,19,2,'','Bootiful','Pre-Feedback',1),(281,'A86605223036',16,20,2,'','Bootiful','Pre-Feedback',1),(282,'A86605223036',16,21,4,'','Bootiful','Pre-Feedback',1),(283,'A86605223036',16,22,5,'','Bootiful','Pre-Feedback',1),(284,'A86605223036',16,23,3,'','Bootiful','Pre-Feedback',1),(285,'A86605223036',16,24,3,'','Bootiful','Pre-Feedback',1),(286,'A86605223036',16,25,2,'','Bootiful','Pre-Feedback',1),(287,'A86605223036',16,26,4,'','Bootiful','Pre-Feedback',1),(288,'A86605223036',17,1,3,'','Bootiful','Pre-Feedback',1),(289,'A86605223036',17,2,3,'','Bootiful','Pre-Feedback',1),(290,'A86605223036',17,3,5,'','Bootiful','Pre-Feedback',1),(291,'A86605223036',17,4,4,'','Bootiful','Pre-Feedback',1),(292,'A86605223036',17,5,3,'','Bootiful','Pre-Feedback',1),(293,'A86605223036',17,6,4,'','Bootiful','Pre-Feedback',1),(294,'A86605223036',17,7,3,'','Bootiful','Pre-Feedback',1),(295,'A86605223036',17,8,5,'','Bootiful','Pre-Feedback',1),(296,'A86605223036',17,9,3,'','Bootiful','Pre-Feedback',1),(297,'A86605223036',17,10,5,'','Bootiful','Pre-Feedback',1),(298,'A86605223036',17,11,2,'','Bootiful','Pre-Feedback',1),(299,'A86605223036',17,12,5,'','Bootiful','Pre-Feedback',1),(300,'A86605223036',17,13,3,'','Bootiful','Pre-Feedback',1),(301,'A86605223036',17,14,5,'','Bootiful','Pre-Feedback',1),(302,'A86605223036',17,15,5,'','Bootiful','Pre-Feedback',1),(303,'A86605223036',17,16,2,'','Bootiful','Pre-Feedback',1),(304,'A86605223036',17,17,5,'','Bootiful','Pre-Feedback',1),(305,'A86605223036',17,18,2,'','Bootiful','Pre-Feedback',1),(306,'A86605223036',17,19,5,'','Bootiful','Pre-Feedback',1),(307,'A86605223036',17,20,4,'','Bootiful','Pre-Feedback',1),(308,'A86605223036',17,21,2,'','Bootiful','Pre-Feedback',1),(309,'A86605223036',17,22,3,'','Bootiful','Pre-Feedback',1),(310,'A86605223036',17,23,4,'','Bootiful','Pre-Feedback',1),(311,'A86605223036',17,24,2,'','Bootiful','Pre-Feedback',1),(312,'A86605223036',17,25,5,'','Bootiful','Pre-Feedback',1),(313,'A86605223036',17,26,5,'','Bootiful','Pre-Feedback',1),(314,'A86605223036',18,1,5,'','Bootiful','Pre-Feedback',1),(315,'A86605223036',18,2,5,'','Bootiful','Pre-Feedback',1),(316,'A86605223036',18,3,4,'','Bootiful','Pre-Feedback',1),(317,'A86605223036',18,4,2,'','Bootiful','Pre-Feedback',1),(318,'A86605223036',18,5,4,'','Bootiful','Pre-Feedback',1),(319,'A86605223036',18,6,5,'','Bootiful','Pre-Feedback',1),(320,'A86605223036',18,7,5,'','Bootiful','Pre-Feedback',1),(321,'A86605223036',18,8,3,'','Bootiful','Pre-Feedback',1),(322,'A86605223036',18,9,4,'','Bootiful','Pre-Feedback',1),(323,'A86605223036',18,10,2,'','Bootiful','Pre-Feedback',1),(324,'A86605223036',18,11,3,'','Bootiful','Pre-Feedback',1),(325,'A86605223036',18,12,2,'','Bootiful','Pre-Feedback',1),(326,'A86605223036',18,13,4,'','Bootiful','Pre-Feedback',1),(327,'A86605223036',18,14,3,'','Bootiful','Pre-Feedback',1),(328,'A86605223036',18,15,5,'','Bootiful','Pre-Feedback',1),(329,'A86605223036',18,16,3,'','Bootiful','Pre-Feedback',1),(330,'A86605223036',18,17,2,'','Bootiful','Pre-Feedback',1),(331,'A86605223036',18,18,3,'','Bootiful','Pre-Feedback',1),(332,'A86605223036',18,19,5,'','Bootiful','Pre-Feedback',1),(333,'A86605223036',18,20,5,'','Bootiful','Pre-Feedback',1),(334,'A86605223036',18,21,5,'','Bootiful','Pre-Feedback',1),(335,'A86605223036',18,22,4,'','Bootiful','Pre-Feedback',1),(336,'A86605223036',18,23,5,'','Bootiful','Pre-Feedback',1),(337,'A86605223036',18,24,3,'','Bootiful','Pre-Feedback',1),(338,'A86605223036',18,25,2,'','Bootiful','Pre-Feedback',1),(339,'A86605223036',18,26,5,'','Bootiful','Pre-Feedback',1),(340,'A86605223036',19,1,5,'','Bootiful','Pre-Feedback',1),(341,'A86605223036',19,2,5,'','Bootiful','Pre-Feedback',1),(342,'A86605223036',19,3,5,'','Bootiful','Pre-Feedback',1),(343,'A86605223036',19,4,5,'','Bootiful','Pre-Feedback',1),(344,'A86605223036',19,5,2,'','Bootiful','Pre-Feedback',1),(345,'A86605223036',19,6,3,'','Bootiful','Pre-Feedback',1),(346,'A86605223036',19,7,3,'','Bootiful','Pre-Feedback',1),(347,'A86605223036',19,8,5,'','Bootiful','Pre-Feedback',1),(348,'A86605223036',19,9,2,'','Bootiful','Pre-Feedback',1),(349,'A86605223036',19,10,3,'','Bootiful','Pre-Feedback',1),(350,'A86605223036',19,11,4,'','Bootiful','Pre-Feedback',1),(351,'A86605223036',19,12,3,'','Bootiful','Pre-Feedback',1),(352,'A86605223036',19,13,5,'','Bootiful','Pre-Feedback',1),(353,'A86605223036',19,14,4,'','Bootiful','Pre-Feedback',1),(354,'A86605223036',19,15,5,'','Bootiful','Pre-Feedback',1),(355,'A86605223036',19,16,4,'','Bootiful','Pre-Feedback',1),(356,'A86605223036',19,17,3,'','Bootiful','Pre-Feedback',1),(357,'A86605223036',19,18,4,'','Bootiful','Pre-Feedback',1),(358,'A86605223036',19,19,5,'','Bootiful','Pre-Feedback',1),(359,'A86605223036',19,20,5,'','Bootiful','Pre-Feedback',1),(360,'A86605223036',19,21,3,'','Bootiful','Pre-Feedback',1),(361,'A86605223036',19,22,5,'','Bootiful','Pre-Feedback',1),(362,'A86605223036',19,23,5,'','Bootiful','Pre-Feedback',1),(363,'A86605223036',19,24,4,'','Bootiful','Pre-Feedback',1),(364,'A86605223036',19,25,5,'','Bootiful','Pre-Feedback',1),(365,'A86605223036',19,26,5,'','Bootiful','Pre-Feedback',1),(366,'A86605223036',20,1,5,'','Bootiful','Pre-Feedback',1),(367,'A86605223036',20,2,2,'','Bootiful','Pre-Feedback',1),(368,'A86605223036',20,3,4,'','Bootiful','Pre-Feedback',1),(369,'A86605223036',20,4,5,'','Bootiful','Pre-Feedback',1),(370,'A86605223036',20,5,5,'','Bootiful','Pre-Feedback',1),(371,'A86605223036',20,6,5,'','Bootiful','Pre-Feedback',1),(372,'A86605223036',20,7,5,'','Bootiful','Pre-Feedback',1),(373,'A86605223036',20,8,2,'','Bootiful','Pre-Feedback',1),(374,'A86605223036',20,9,3,'','Bootiful','Pre-Feedback',1),(375,'A86605223036',20,10,4,'','Bootiful','Pre-Feedback',1),(376,'A86605223036',20,11,2,'','Bootiful','Pre-Feedback',1),(377,'A86605223036',20,12,4,'','Bootiful','Pre-Feedback',1),(378,'A86605223036',20,13,5,'','Bootiful','Pre-Feedback',1),(379,'A86605223036',20,14,5,'','Bootiful','Pre-Feedback',1),(380,'A86605223036',20,15,3,'','Bootiful','Pre-Feedback',1),(381,'A86605223036',20,16,2,'','Bootiful','Pre-Feedback',1),(382,'A86605223036',20,17,4,'','Bootiful','Pre-Feedback',1),(383,'A86605223036',20,18,2,'','Bootiful','Pre-Feedback',1),(384,'A86605223036',20,19,3,'','Bootiful','Pre-Feedback',1),(385,'A86605223036',20,20,5,'','Bootiful','Pre-Feedback',1),(386,'A86605223036',20,21,5,'','Bootiful','Pre-Feedback',1),(387,'A86605223036',20,22,5,'','Bootiful','Pre-Feedback',1),(388,'A86605223036',20,23,5,'','Bootiful','Pre-Feedback',1),(389,'A86605223036',20,24,2,'','Bootiful','Pre-Feedback',1),(390,'A86605223036',20,25,2,'','Bootiful','Pre-Feedback',1),(391,'A86605223036',20,26,5,'','Bootiful','Pre-Feedback',1),(392,'A86605223036',21,1,5,'','Bootiful','Pre-Feedback',1),(393,'A86605223036',21,2,5,'','Bootiful','Pre-Feedback',1),(394,'A86605223036',21,3,2,'','Bootiful','Pre-Feedback',1),(395,'A86605223036',21,4,5,'','Bootiful','Pre-Feedback',1),(396,'A86605223036',21,5,2,'','Bootiful','Pre-Feedback',1),(397,'A86605223036',21,6,2,'','Bootiful','Pre-Feedback',1),(398,'A86605223036',21,7,5,'','Bootiful','Pre-Feedback',1),(399,'A86605223036',21,8,5,'','Bootiful','Pre-Feedback',1),(400,'A86605223036',21,9,4,'','Bootiful','Pre-Feedback',1),(401,'A86605223036',21,10,2,'','Bootiful','Pre-Feedback',1),(402,'A86605223036',21,11,5,'','Bootiful','Pre-Feedback',1),(403,'A86605223036',21,12,2,'','Bootiful','Pre-Feedback',1),(404,'A86605223036',21,13,2,'','Bootiful','Pre-Feedback',1),(405,'A86605223036',21,14,3,'','Bootiful','Pre-Feedback',1),(406,'A86605223036',21,15,4,'','Bootiful','Pre-Feedback',1),(407,'A86605223036',21,16,5,'','Bootiful','Pre-Feedback',1),(408,'A86605223036',21,17,2,'','Bootiful','Pre-Feedback',1),(409,'A86605223036',21,18,5,'','Bootiful','Pre-Feedback',1),(410,'A86605223036',21,19,5,'','Bootiful','Pre-Feedback',1),(411,'A86605223036',21,20,2,'','Bootiful','Pre-Feedback',1),(412,'A86605223036',21,21,2,'','Bootiful','Pre-Feedback',1),(413,'A86605223036',21,22,3,'','Bootiful','Pre-Feedback',1),(414,'A86605223036',21,23,2,'','Bootiful','Pre-Feedback',1),(415,'A86605223036',21,24,5,'','Bootiful','Pre-Feedback',1),(416,'A86605223036',21,25,5,'','Bootiful','Pre-Feedback',1),(417,'A86605223036',21,26,5,'','Bootiful','Pre-Feedback',1),(418,'A86605223036',22,1,3,'','Bootiful','Pre-Feedback',1),(419,'A86605223036',22,2,5,'','Bootiful','Pre-Feedback',1),(420,'A86605223036',22,3,5,'','Bootiful','Pre-Feedback',1),(421,'A86605223036',22,4,5,'','Bootiful','Pre-Feedback',1),(422,'A86605223036',22,5,3,'','Bootiful','Pre-Feedback',1),(423,'A86605223036',22,6,5,'','Bootiful','Pre-Feedback',1),(424,'A86605223036',22,7,4,'','Bootiful','Pre-Feedback',1),(425,'A86605223036',22,8,2,'','Bootiful','Pre-Feedback',1),(426,'A86605223036',22,9,2,'','Bootiful','Pre-Feedback',1),(427,'A86605223036',22,10,3,'','Bootiful','Pre-Feedback',1),(428,'A86605223036',22,11,2,'','Bootiful','Pre-Feedback',1),(429,'A86605223036',22,12,4,'','Bootiful','Pre-Feedback',1),(430,'A86605223036',22,13,5,'','Bootiful','Pre-Feedback',1),(431,'A86605223036',22,14,4,'','Bootiful','Pre-Feedback',1),(432,'A86605223036',22,15,2,'','Bootiful','Pre-Feedback',1),(433,'A86605223036',22,16,2,'','Bootiful','Pre-Feedback',1),(434,'A86605223036',22,17,4,'','Bootiful','Pre-Feedback',1),(435,'A86605223036',22,18,3,'','Bootiful','Pre-Feedback',1),(436,'A86605223036',22,19,2,'','Bootiful','Pre-Feedback',1),(437,'A86605223036',22,20,5,'','Bootiful','Pre-Feedback',1),(438,'A86605223036',22,21,3,'','Bootiful','Pre-Feedback',1),(439,'A86605223036',22,22,4,'','Bootiful','Pre-Feedback',1),(440,'A86605223036',22,23,5,'','Bootiful','Pre-Feedback',1),(441,'A86605223036',22,24,2,'','Bootiful','Pre-Feedback',1),(442,'A86605223036',22,25,3,'','Bootiful','Pre-Feedback',1),(443,'A86605223036',22,26,5,'','Bootiful','Pre-Feedback',1),(444,'A86605223036',23,1,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(445,'A86605223036',23,2,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(446,'A86605223036',23,3,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(447,'A86605223036',23,4,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(448,'A86605223036',23,5,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(449,'A86605223036',23,6,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(450,'A86605223036',23,7,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(451,'A86605223036',23,8,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(452,'A86605223036',23,9,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(453,'A86605223036',23,10,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(454,'A86605223036',23,11,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(455,'A86605223036',23,12,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(456,'A86605223036',23,13,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(457,'A86605223036',23,14,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(458,'A86605223036',23,15,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(459,'A86605223036',23,16,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(460,'A86605223036',23,17,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(461,'A86605223036',23,18,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(462,'A86605223036',23,19,3,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(463,'A86605223036',23,20,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(464,'A86605223036',23,21,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(465,'A86605223036',23,22,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(466,'A86605223036',23,23,2,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(467,'A86605223036',23,24,3,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(468,'A86605223036',23,25,4,'Ms. Varshini S','Bootiful','Pre-Feedback',1),(469,'A86605223036',23,26,5,'Ms. Varshini S','Bootiful','Pre-Feedback',1);
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `studentId` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `semester` int NOT NULL,
  `course` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  PRIMARY KEY (`studentId`),
  CONSTRAINT `students_chk_1` CHECK ((`semester` between 1 and 8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('A86605223001','NEHA T V',1,'B.Tech CSE','A86605223001','A86605223001'),('A86605223002','MITHALI K P',1,'B.Tech CSE','A86605223002','A86605223002'),('A86605223003','SHREYA SHERIKAR',1,'B.Tech CSE','A86605223003','A86605223003'),('A86605223004','DRUPAD G',1,'B.Tech CSE','A86605223004','A86605223004'),('A86605223005','NEHA B N',1,'B.Tech CSE','A86605223005','A86605223005'),('A86605223007','NITHYASHREE P',1,'B.Tech CSE','A86605223007','A86605223007'),('A86605223008','VIKAS GOWDA NS',1,'B.Tech CSE','A86605223008','A86605223008'),('A86605223009','ILAAF MUSHTAK SHAIKH',1,'B.Tech CSE','A86605223009','A86605223009'),('A86605223010','SANJAN B N',1,'B.Tech CSE','A86605223010','A86605223010'),('A86605223011','DAYASHREE S',1,'B.Tech CSE','A86605223011','A86605223011'),('A86605223012','SUPREETH D',1,'B.Tech CSE','A86605223012','A86605223012'),('A86605223013','CHIRAG S',1,'B.Tech CSE','A86605223013','A86605223013'),('A86605223014','VAISHALI C R',1,'B.Tech CSE','A86605223014','A86605223014'),('A86605223015','AVILA PRINCY M',1,'B.Tech CSE','A86605223015','A86605223015'),('A86605223016','MOKSHA V',1,'B.Tech CSE','A86605223016','A86605223016'),('A86605223017','KHUSHI M C',1,'B.Tech CSE','A86605223017','A86605223017'),('A86605223018','PRAVEEN KUMAR V B',1,'B.Tech CSE','A86605223018','A86605223018'),('A86605223019','YOSHITHA M R',1,'B.Tech CSE','A86605223019','A86605223019'),('A86605223020','DEEPAK S',1,'B.Tech CSE','A86605223020','A86605223020'),('A86605223021','KIRANKUMAR R',1,'B.Tech CSE','A86605223021','A86605223021'),('A86605223022','DHANUSH P SOORYA',1,'B.Tech CSE','A86605223022','A86605223022'),('A86605223023','SUMIT BILGIKAR',1,'B.Tech CSE','A86605223023','A86605223023'),('A86605223024','PEEYUSH RAMPAL',1,'B.Tech CSE','A86605223024','A86605223024'),('A86605223025','KAVYA M',1,'B.Tech CSE','A86605223025','A86605223025'),('A86605223027','SALONI KUMARI',1,'B.Tech CSE','A86605223027','A86605223027'),('A86605223028','AROOR AKSHAY RAO',1,'B.Tech CSE','A86605223028','A86605223028'),('A86605223029','CHARITHA T',1,'B.Tech CSE','A86605223029','A86605223029'),('A86605223030','CHANDANA K R',1,'B.Tech CSE','A86605223030','A86605223030'),('A86605223031','KISHOR G',1,'B.Tech CSE','A86605223031','A86605223031'),('A86605223032','LIKHITH GOWDA K B',1,'B.Tech CSE','A86605223032','A86605223032'),('A86605223033','ABHISHEK PATIL',1,'B.Tech CSE','A86605223033','A86605223033'),('A86605223034','ABHIJEET SALE',1,'B.Tech CSE','A86605223034','A86605223034'),('A86605223035','TEJASHWINI S',1,'B.Tech CSE','A86605223035','A86605223035'),('A86605223036','ADITTHYA S S VARMA',1,'B.Tech CSE','A86605223036','A86605223036'),('A86605223037','KOTLA SAI SIDDHARDHA',1,'B.Tech CSE','A86605223037','A86605223037'),('A86605223038','PARTHA R',1,'B.Tech CSE','A86605223038','A86605223038'),('A86605223039','PRAJWAL M P',1,'B.Tech CSE','A86605223039','A86605223039'),('A86605223040','GADUGINA NAVEEN',1,'B.Tech CSE','A86605223040','A86605223040'),('A86605223041','  KONDAPALLI KUSHMITHA',1,'B.Tech AIML','A86605223041','A86605223041'),('A86605223042','GONDI SAI SHASHANK',1,'B.Tech CSE','A86605223042','A86605223042'),('A86605223043','BHADDAROLLU VIGNESH KUMAR',1,'B.Tech CSE','A86605223043','A86605223043'),('A86605223044','POKURI HARSHA VARDHAN NAIDU',1,'B.Tech CSE','A86605223044','A86605223044'),('A86605223045','GOLLA KOUSHIK YADAV',1,'B.Tech CSE','A86605223045','A86605223045'),('A86605223046','KANAM HARSHITH REDDY',1,'B.Tech CSE','A86605223046','A86605223046'),('A86605223047','K VAZIYA',1,'B.Tech CSE','A86605223047','A86605223047'),('A86605223048','RAJATH P',1,'B.Tech CSE','A86605223048','A86605223048'),('A86605223049','MOHAMMED ZAID HARIS',1,'B.Tech CSE','A86605223049','A86605223049'),('A86605223050','MONIKA PANDEY',1,'B.Tech CSE','A86605223050','A86605223050'),('A86605223051','NALI VENKATA AKHIL',1,'B.Tech CSE','A86605223051','A86605223051'),('A86605223052','MONIKA C M',1,'B.Tech CSE','A86605223052','A86605223052'),('A86605223053','MINHAJ',1,'B.Tech CSE','A86605223053','A86605223053'),('A86605223054','EMME NITHIN KUMAR',1,'B.Tech CSE','A86605223054','A86605223054'),('A866132523001','  VAISHNAVI H B',1,'B.Tech AIML','A866132523001','A866132523001'),('A866132523002','  SUMITH KUMAR GUPTA',1,'B.Tech AIML','A866132523002','A866132523002'),('A866132523003','  VAMSHI KUMAR C R',1,'B.Tech AIML','A866132523003','A866132523003'),('A866132523004','  GANAVI C',1,'B.Tech AIML','A866132523004','A866132523004'),('A866132523005','  NITHYASHREE .M',1,'B.Tech AIML','A866132523005','A866132523005'),('A866132523007','  SHOAIB MALIK',1,'B.Tech AIML','A866132523007','A866132523007'),('A866132523008','  GLENN DWIGHT DSILVA',1,'B.Tech AIML','A866132523008','A866132523008'),('A866132523009','  CHINMAY D',1,'B.Tech AIML','A866132523009','A866132523009'),('A866132523010','  MUSKAN KUMARI',1,'B.Tech AIML','A866132523010','A866132523010'),('A866132523011','  JAHNAVI L',1,'B.Tech AIML','A866132523011','A866132523011'),('A866132523012','  BHAAV GOEL',1,'B.Tech AIML','A866132523012','A866132523012'),('A866132523014','  SAMYUKTA R',1,'B.Tech AIML','A866132523014','A866132523014'),('A866132523015','  VEDANTH ARYAN R',1,'B.Tech AIML','A866132523015','A866132523015'),('A866132523016','  KUNAL S CHANDNANI',1,'B.Tech AIML','A866132523016','A866132523016'),('A866132523017','  BANAPURAM DHARMA TEJA',1,'B.Tech AIML','A866132523017','A866132523017'),('A866132523018','  SHYAMJI PANDEY',1,'B.Tech AIML','A866132523018','A866132523018'),('A866132523019','  PAVAN DINESH HEGDE',1,'B.Tech AIML','A866132523019','A866132523019'),('A866132523020','  AVISHKA V',1,'B.Tech AIML','A866132523020','A866132523020'),('A866132523021','  UTKARSH MISHRA',1,'B.Tech AIML','A866132523021','A866132523021'),('A866132523022','  TONY PARTHIV GOSALA',1,'B.Tech AIML','A866132523022','A866132523022'),('A866132523023','  BHASKAR P',1,'B.Tech AIML','A866132523023','A866132523023'),('A866132523024','  BHAVYA G RAJ',1,'B.Tech AIML','A866132523024','A866132523024'),('A866132523025','  SINDHU NM',1,'B.Tech AIML','A866132523025','A866132523025'),('A866132523026','  NITHIN R',1,'B.Tech AIML','A866132523026','A866132523026'),('A866132523027','  AVINASHREDDY DONGALE',1,'B.Tech AIML','A866132523027','A866132523027'),('A866132523028','  HEMAMADHURI B',1,'B.Tech AIML','A866132523028','A866132523028'),('A866132523029','  SHARAN',1,'B.Tech AIML','A866132523029','A866132523029'),('A866132523030','  ABHILASH GOWDA.A',1,'B.Tech AIML','A866132523030','A866132523030'),('A866132523031','  SAMSON PRAKASH JOSEPH',1,'B.Tech AIML','A866132523031','A866132523031'),('A866132523032','  NEHEMIAH MATHEW',1,'B.Tech AIML','A866132523032','A866132523032'),('A866132523033','  ZAID HANAGANDI',1,'B.Tech AIML','A866132523033','A866132523033'),('A866132523034','  NAVEEN KUMAR T',1,'B.Tech AIML','A866132523034','A866132523034'),('A866132523035','  MANOJ T G',1,'B.Tech AIML','A866132523035','A866132523035'),('A866132523036','  DHRITHI S',1,'B.Tech AIML','A866132523036','A866132523036'),('A866132523037','  VIJAY S',1,'B.Tech AIML','A866132523037','A866132523037'),('A866132523038','  NEHA MAIYA',1,'B.Tech AIML','A866132523038','A866132523038'),('A866132523041','  G PREM SAGAR REDDY',1,'B.Tech AIML','A866132523041','A866132523041'),('A866132523042','  SHREYA SHANKAR MAGAJI',1,'B.Tech AIML','A866132523042','A866132523042');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') NOT NULL,
  `course` varchar(255) DEFAULT NULL,
  `semester` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `studentId` (`studentId`),
  CONSTRAINT `users_chk_1` CHECK ((`semester` between 1 and 8))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Admin','$2b$10$wOclPQaPgTCeXj1R4Fi7z.cMPu1D7CFo/UbsCHc4FMSJwgCJMc4sy','admin',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 20:59:32
