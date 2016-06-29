/*
    Select all answers relating to a particular user
*/

SELECT * FROM Answers 
WHERE Answers.user_id = $1;