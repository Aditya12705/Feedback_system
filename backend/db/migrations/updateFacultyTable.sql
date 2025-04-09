-- Backup current faculties
CREATE TABLE faculties_backup AS SELECT * FROM faculties;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop primary key and modify the column
ALTER TABLE faculties MODIFY COLUMN id INT;
ALTER TABLE faculties DROP PRIMARY KEY;

-- Update IDs sequentially
UPDATE faculties SET id = (
    SELECT new_id 
    FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY id) as new_id, id as old_id 
        FROM faculties
    ) AS t 
    WHERE t.old_id = faculties.id
);

-- Add back primary key with auto_increment
ALTER TABLE faculties MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
