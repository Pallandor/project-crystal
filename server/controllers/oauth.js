const axios = require('axios');
const merge = require('lodash/merge');

/**
 * Step 1 of facebook authentication.
 * NOTE: When you change env.FACEBOOK_REDIRECT_URI, you must also change it in FB App Dashboard. 
 */
// for testing (modify first!): https://www.facebook.com/dialog/oauth?client_id=287364934946689&response_type=code&redirect_uri=http://localhost:3006/facebook
exports.redirectToFacebookSignin = (req, res) => {
  res.redirect(
    `https://www.facebook.com/dialog/oauth?` +
    `client_id=${process.env.FACEBOOK_ID}` +
    `&response_type=code` +
    `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`
  );
};

/**
 * Step 2 of facebook authentication. 
 * If delegated authentication is successful, we will populate req.user.facebook with returned
 * facebook user values and continue to next middleware. 
 */
exports.obtainFacebookCredentials = (req, res, next) => {
  if (req.query.error_reason && req.query.error_reason === 'user_denied') {
    res.redirect('/signin');
  }

  const facebookExchangeCodeForAccessToken = `https://graph.facebook.com/v2.3/oauth/access_token?` +
    `&client_id=${process.env.FACEBOOK_ID}` +
    `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
    `&client_secret=${process.env.FACEBOOK_SECRET}` +
    `&code=${req.query.code}`;

  axios.get(facebookExchangeCodeForAccessToken)
    .then(tokenResponse => {

      const facebookInspectAccessToken = `https://graph.facebook.com/debug_token?` +
        `input_token=${tokenResponse.data.access_token}` +
        `&access_token=${appid}|${appsecret}`;

      axios.get(facebookInspectAccessToken)
        .then(inspectionResponse => {

          const facebookFetchProfile = `https://graph.facebook.com` +
            `/me?fields=id,email,first_name,last_name`;

          axios.get(facebookFetchProfile, {
              headers: {
                Authorization: 'Bearer ' + tokenResponse.data.access_token,
              },
            })
            .then(fetchedProfile => {
              req.user = {
                facebook: merge({}, fetchedProfile);
              };
              next();
            });
        });
    })
    .catch(err => console.log(err));
};