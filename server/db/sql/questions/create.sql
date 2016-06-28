/*
    Creates Questions table
    Includes Trigger which updates updated_at column with current date 
    whenever a Questions row is updated. 
*/
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE Questions (
question_id serial PRIMARY KEY,
category citext NOT NULL,
question_text citext NOT NULL,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger AS
$$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER uuac_questions
BEFORE UPDATE ON Questions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 