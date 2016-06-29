/*
    Insert a new Answer and return the newly inserted Answer row. 
*/
INSERT INTO Answers (question_id, user_id, couple_id, answer_text)
VALUES (${question_id}, ${user_id}, ${couple_id}, LOWER(${answer_text}))
RETURNING *