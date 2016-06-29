/*
    Select all answers relating to a particular couple
*/

SELECT * FROM Answers 
INNER JOIN Questions
ON Answers.question_id = Questions.question_id
WHERE Answers.couple_id = $1;