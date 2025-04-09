ALTER TABLE scores 
ADD COLUMN semester INT 
AFTER feedbackType;

SELECT * FROM scores 
JOIN students ON scores.student_id = students.student_id
JOIN faculties ON scores.faculty_id = faculties.id
ORDER BY scores.student_id, scores.feedbackType;
