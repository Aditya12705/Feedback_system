-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_faculties_id ON faculties;

-- Create new index
CREATE INDEX idx_faculties_id ON faculties(id);

-- Update id column to be auto_increment
ALTER TABLE faculties MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY;
