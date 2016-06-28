/*
    Insert a new question record
    Returns the inserted question. 
*/
INSERT INTO Questions(category, question_text)
VALUES(${category}, ${question_text})
RETURNING *