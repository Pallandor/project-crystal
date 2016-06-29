/*
    Selects a particular answer by answer ID
*/

SELECT * FROM Answers
INNER JOIN Questions
ON Questions.question_id = Answers.question_id
WHERE Answers.answer_id = $1;