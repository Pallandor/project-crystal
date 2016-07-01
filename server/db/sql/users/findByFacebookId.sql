
/**
 *       Finds user record with matching Facebook Profile ID
 *       (facebook_id is a citext column, so case sensitivity should NOT be an issue)
 */

 SELECT * FROM Users
 WHERE Users.facebook_id = $1;