/*
    Remove a question.
*/

DELETE from ${schema~}.Questions
WHERE question_id = $1
RETURNING *; 