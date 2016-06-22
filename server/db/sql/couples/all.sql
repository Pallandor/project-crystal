/*
    Selects all existing couples records.
*/

SELECT * FROM ${schema~}.Couples as Couples
INNER JOIN ${schema~}.couples_users as couples_users
ON Couples.couple_id = couples_users.couple_id
INNER JOIN ${schema~}.Users as Users
ON Users.user_id = couples_users.user_id;