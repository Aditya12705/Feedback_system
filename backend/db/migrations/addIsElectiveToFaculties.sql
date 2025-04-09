ALTER TABLE faculties
ADD COLUMN isElective BOOLEAN DEFAULT FALSE;

-- Update existing faculties where name contains '/' to be marked as elective
UPDATE faculties 
SET isElective = TRUE 
WHERE name LIKE '%/%';
