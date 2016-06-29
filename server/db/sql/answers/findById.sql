/*
    Selects a particular answer by answer ID
*/

SELECT * FROM Answers 
WHERE Answers.answer_id = $1;
