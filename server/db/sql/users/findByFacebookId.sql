
/**
 *       Finds user record with matching Facebook Profile ID
 *       (facebook_id is a citext column, so case sensitivity should NOT be an issue)
 *       RF: Move facebook_id etc to separate OAuth Accounts Table (for extensibility with future OAuths)
 */

 SELECT * FROM Users
 INNER JOIN Couples
 ON Users.couple_id = Couples.couple_id
 WHERE Users.facebook_id = $1;