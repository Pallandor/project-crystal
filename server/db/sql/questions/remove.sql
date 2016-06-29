/*
    Remove couples record from Questions.
*/

DELETE from ${schema~}.Questions
WHERE question_id = $1
RETURNING *; 