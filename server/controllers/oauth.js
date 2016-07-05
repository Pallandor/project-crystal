const axios = require('axios');
const merge = require('lodash/merge');
const Users = require(__dirname + '/../db/index').db.users;
const jwt = require('jsonwebtoken');
const jwtSecret = 'bolivia' // should be in a config or env. 

/**
 * Step 1 of facebook authentication.
 * Redirect user to delegated facebook authentication.
 * NOTE: When you change env.FACEBOOK_REDIRECT_URI, you must also change it in FB App Dashboard. And in Valid OAuth Redirect URIs on Dash
  // --- for testing (modify first!): https://www.facebook.com/dialog/oauth?client_id=287364934946689&response_type=code&redirect_uri=http://localhost:3006/facebook
 */
const redirectSigninToFacebook = (req, res) => {
  res.redirect(
    `https://www.facebook.com/dialog/oauth?` +
    `client_id=${process.env.FACEBOOK_ID}` +
    `&response_type=code` +
    `&scope=email` +
    `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`
  );
};

/**
 * Step 2 of facebook authentication. 
 * If delegated authentication is successful, populate req.oauth.facebook with returned
 * facebook user/profile information and continue to next middleware. 
 */
const obtainCredentialsFromFacebook = (req, res, next) => {
  console.log('inside obtainCredentialsFromFacebook .... ++++++++++++++');
  if (req.query.error_reason && req.query.error_reason === 'user_denied') {
    res.redirect('/signin');
  } else {
    const facebookExchangeCodeForAccessTokenURI = `https://graph.facebook.com/v2.3/oauth/access_token?` +
      `&client_id=${process.env.FACEBOOK_ID}` +
      `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
      `&client_secret=${process.env.FACEBOOK_SECRET}` +
      `&code=${req.query.code}`;
    console.log('..... inside obtainCredentialsFromFacebook, the value of req.query.code is: ', req.query.code);
    axios.get(facebookExchangeCodeForAccessTokenURI)
      .then(tokenResponse => {
        console.log('...... the tokenResponse.access token is:', tokenResponse.data.access_token);
        const facebookInspectAccessTokenURI = `https://graph.facebook.com/debug_token?` +
          `input_token=${tokenResponse.data.access_token}` +
          `&access_token=${process.env.FACEBOOK_ID}|${process.env.FACEBOOK_SECRET}`;

        axios.get(facebookInspectAccessTokenURI)
          .then(inspectionResponse => {

            /* RF: Must add checks here, this is the entire basis for inspecting the access token on debug_token route.
             */

            const facebookFetchProfileURI = `https://graph.facebook.com` +
              `/v2.6/me?fields=id,first_name,last_name,email`;

            axios.get(facebookFetchProfileURI, {
                headers: {
                  Authorization: 'Bearer ' + tokenResponse.data.access_token,
                },
              })
              .then(fetchedProfile => {
                if (fetchedProfile) {
                  console.log('the fetched profile is...', fetchedProfile.data);
                  // RF: may need to modify req.oauth.facebook.id to req.oauth.facebook.facebook_id to standarize with DB controllers
                  if (fetchedProfile.data.email) {
                    req.oauth = {
                      facebook: merge({}, fetchedProfile.data, { access_token: tokenResponse.data.access_token }), // Ensure this adds access token!
                    };
                    next();
                  } else {
                    res.json('We were unable to retrieve your email address from Facebook. Please contact Facebook or login using our primary email/password method.');
                  }
                } else {
                  res.send('There was an error fetching the Facebook profile');
                }
              }); // need error handlers...
          });
      })
      .catch(err => next(err));
  }
};

/**
 * Step 3 of facebook authentication. 
 * Verify that there is no existing account currently linked to the OAuth ID or email. If there is for the OAuth ID,
 * then set req.user with the existing account information, as this will be recognised as a successful 'sign-in' action by the
 * signSendJWT middleware. However, a matching email account will prompt a string response that the client will recognize and
 * pass on to the user, prompting the user to sign in with the matched email address. 
 */
const verifyExistingAccountsFacebook = (req, res, next) => {
  console.log('inside verifyExistingAccounts... +++++++++');
  Users.findByFacebookId(req.oauth.facebook.id)
    .then(foundFacebookUser => {
      console.log('inside findByFacebookId.... +++++++++');
      if (foundFacebookUser) {
        req.user = merge({}, foundFacebookUser);
        next();
      } else {
        Users.findByEmail(req.oauth.facebook.email)
          .then(foundEmailUser => {
            console.log('+++++++++ inside users find by email in facebook... ');
            if (foundEmailUser) {
              console.log('the found email user path... to send error next');
              res.status(422).json('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.');
            } else {
              console.log('the continue acct creation path... ');
              next();
            }
          })
      }
    })
    .catch(err => console.log('There was an error in checking existing acounts', err));
};


/**
 * Step 4 of facebook authentication. 
 * If the standard sign-in process has been completed and req.user has been assigned a value, sign and send a
 * JSON Web Token to the client, including relevant user information in the payload. Otherwise, pass error message
 * if middleware declared with 'end' argument or else continue to next middleware. 
 */
// const signSendJWT = (req, res, next) => {
//   console.log('inside signSendJWT....');
//   next();
// };

const signSendJWT = (req,res,next) => {next();}; 

// const signSendJWT = (middlewarePlacement) => {
//   // console.log('inside signSendJWT ++++++++++++++++');
//   console.log('inside signsendJWT ++++++++ '); 
//   return (req, res, next) => {
//     console.log('insige signSendJWT +++++++++++++++');
//     if (req.user) {
//       console.log('before sending jwt....');
//       const token = jwt.sign({ user: req.user }, jwtSecret);
//       res.json({ token: token });
//     } else {
//       console.log('before sending error from jwt....');
//       if (middlewarePlacement === 'end') {
//         res.status(422).json('There was an error creating the account. Please try again.');
//       } else {
//         next();
//       }
//     }
//   };
// };

/**
 * Step 5 of facebook authentication. 
 * This middleware will only be reached if no existing user accounts have been linked to the facebook authenticated
 * ID or email. Subequently, send a response to the client which will prompt the client to query the user whether
 * they are the first of a couple to sign up, or for the other relevant user's email. The response will include the current 
 * OAuth data obtained to persist it across redirects (RF: Refactor for security).  
 */
const queryCoupleStatus = (req, res) => {
  console.log('inside query couple status...');
  res.status(200).json({
    coupleQuery: true,
    oauth: req.oauth,
  });
};

/**
 * Step 6 of facebook authentication. 
 * Use returned OAuth and newly obtained couple data to create a new user account. (RF: Users.add is hardcoded to deal with facebook)
 */
const createAccountUsingCredentialsFromFacebook = (req, res, next) => {
  console.log("inside createAccountUsingCredentialsFromFacebook +++++++++++++++++ ");
  if (req.body.user) {
    // RF: likely discrepancy, facebook.id vs facebook_id expected in DB Controller.
    Users.add(req.body.user)
      .then(addedUser => {
        if (addedUser) {
          req.user = merge({}, addedUser);
          next();
        } else {
          res.send('There doesn\'t seem to be a Couple linked to that additional email you provided.');
        }
      })
  } else {
    res.send('Something went wrong. Please try signing in again.');
  }
};


const OAuthController = {
  queryCoupleStatus: queryCoupleStatus,
  signSendJWT: signSendJWT,
  redirectSigninTo: {
    facebook: redirectSigninToFacebook,
  },
  obtainCredentialsFrom: {
    facebook: obtainCredentialsFromFacebook,
  },
  verifyExistingAccounts: {
    facebook: verifyExistingAccountsFacebook,
  },
  createAccountUsingCredentialsFrom: {
    facebook: createAccountUsingCredentialsFromFacebook,
  },
};

module.exports = OAuthController;
