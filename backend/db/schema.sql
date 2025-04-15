-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS feedback_system;
USE feedback_system;

-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS faculties;

-- Create students table
CREATE TABLE students (
    studentId VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    course VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL
);

-- Create faculties table
CREATE TABLE faculties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    subjectName VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    professorName VARCHAR(255) NOT NULL,
    subjectCode VARCHAR(50),
    academicYear VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    isElective BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_faculties_id (id)
);

-- Create questions table
CREATE TABLE questions (
    id INT PRIMARY KEY,
    text TEXT NOT NULL,
    feedbackType ENUM('Pre-Feedback', 'Post-Feedback') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scores table
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId VARCHAR(20) NOT NULL DEFAULT '',
    faculty_id INT NOT NULL,
    selected_faculty VARCHAR(255),
    question_id INT NOT NULL,
    score INT NOT NULL,
    feedbackType ENUM('Pre-Feedback', 'Post-Feedback') NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(studentId),
    FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    INDEX idx_student_id (studentId),
    INDEX idx_faculty_id (faculty_id)
);

-- Add any necessary indexes for performance
CREATE INDEX idx_scores_feedback_type ON scores(feedbackType);
CREATE INDEX idx_scores_semester ON scores(semester);
CREATE INDEX idx_faculties_course ON faculties(courseName);
CREATE INDEX idx_students_course ON students(course);

DELETE FROM scores WHERE student_id = 'STUDENT_USN';
SELECT * FROM scores WHERE student_id = 'A86605223034';