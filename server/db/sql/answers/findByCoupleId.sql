/*
    Select all answers relating to a particular couple
*/

SELECT * FROM Answers 
WHERE Answers.couple_id = $1;
