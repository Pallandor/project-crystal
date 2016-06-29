/*
    Creates Answers table
    Includes UUAC (Update Updated At Column) trigger which updates updated_at column with current date 
    whenever an Answers row is updated. 
    NOTE: Relies on FUNCTION updated_updated_at_column() to be created earlier (currently in Questions Table schema)

    NOTE: if the referenced user (user_id) is deleted, the answer row will be deleted in cascade. 
*/
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE Answers (
answer_id serial PRIMARY KEY,
question_id integer NOT NULL,
user_id integer NOT NULL,
couple_id integer NOT NULL, 
answer_text citext NOT NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (couple_id) REFERENCES Couples(couple_id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TRIGGER uuac_answers
BEFORE UPDATE ON Answers
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 