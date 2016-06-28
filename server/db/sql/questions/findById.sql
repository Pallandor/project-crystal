/*
    Selects a particular question record by question ID
*/

SELECT * FROM Questions 
WHERE question_id = $1;
