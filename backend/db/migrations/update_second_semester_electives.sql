-- Update existing elective faculty or insert new ones for 2nd semester
UPDATE faculties 
SET name = 'Dr. Faculty1/Dr. Faculty2/Dr. Faculty3',
    isElective = TRUE
WHERE semester = '2nd Semester' 
AND subjectName LIKE '%Elective%';

-- In case you need to insert new elective courses
INSERT INTO faculties (name, subject, courseName, subjectName, semester, isElective)
VALUES 
('Dr. Faculty1/Dr. Faculty2/Dr. Faculty3', 'Elective 1', 'B.Tech CSE', 'Professional Elective 1', '2nd Semester', 1),
('Dr. Faculty4/Dr. Faculty5/Dr. Faculty6', 'Elective 2', 'B.Tech CSE', 'Professional Elective 2', '2nd Semester', 1),
('Dr. Faculty7/Dr. Faculty8/Dr. Faculty9', 'Elective 3', 'B.Tech CSE', 'Open Elective 1', '2nd Semester', 1);
