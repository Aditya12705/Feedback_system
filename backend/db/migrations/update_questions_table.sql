ALTER TABLE questions
ADD COLUMN courseName VARCHAR(255) DEFAULT NULL,
ADD COLUMN semester VARCHAR(255) DEFAULT NULL;

-- Index for better query performance
CREATE INDEX idx_questions_feedback_course 
ON questions(feedbackType, courseName);
