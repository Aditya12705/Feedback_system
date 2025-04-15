-- Update scores table to maintain consistent semester values
ALTER TABLE scores MODIFY COLUMN semester INT NOT NULL;

-- Update existing scores to match faculty semester
UPDATE scores s
JOIN faculties f ON s.faculty_id = f.id
SET s.semester = CASE 
    WHEN f.semester LIKE '%1%' THEN 1
    WHEN f.semester LIKE '%2%' THEN 2
    ELSE CAST(SUBSTRING_INDEX(f.semester, ' ', 1) AS SIGNED)
END;

-- Add index for better performance
CREATE INDEX idx_scores_semester ON scores(semester);
