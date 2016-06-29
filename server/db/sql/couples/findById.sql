/*
    Selects a particular couple record by couple id.
*/

SELECT * FROM Couples
WHERE Couples.couple_id = $1
-- // Optimization which may obscure failed UNIQUE constraints: 
-- LIMIT 1
-- WHERE (condition)