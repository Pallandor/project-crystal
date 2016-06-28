/*
    Insert a new question record
    Returns the inserted question. 
*/
INSERT INTO Questions(category, question_text)
VALUES(LOWER(${category}), LOWER(${question_text}))
RETURNING *