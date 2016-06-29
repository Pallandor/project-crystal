/*
    Remove an Answer and return removed Answer
*/

DELETE from Answers
WHERE Answers.answer_id = $1
RETURNING *; 