/*
    Find User record by email
    RF: Potential optimization LIMIT 1 to prevent additional search, but may obscure UNIQUE CONSTRAINT failure
    NOTE: Added Inner Join for FB Authentication purposes. 
*/

SELECT * FROM Users
INNER JOIN Couples
ON Users.couple_id = Users.couple_id
WHERE email = $1