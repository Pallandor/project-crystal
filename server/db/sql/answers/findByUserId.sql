/*
    Select all answers relating to a particular user
*/

SELECT * FROM Answers
INNER JOIN Questions
ON Answers.question_id = Questions.question_id
WHERE Answers.user_id = $1;