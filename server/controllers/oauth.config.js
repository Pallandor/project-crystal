const axios = require('axios');
const merge = require('lodash/merge');
const Users = require(__dirname + '/../db/index').db.users;

app.get('/auth/facebook', OAuthController.redirectSigninTo('facebook'));

app.get('/auth/facebook/callback/',
  OAuthController.obtainCredentialsFrom('facebook'), // set credentials to req.oauth.facebook, next(). 
  OAuthController.verifyExistingAccounts('facebook'), // sign them in (set req.user and jump to signSendJWT) else begin account create 
  OAuthController.signSendJWT, // will always check if req.user set. if set, does JWT sign send, res. else, next(); 
  OAuthController.queryCoupleStatus, // force front end to query client and send response up as json obj to '.../auth/facebook/createAccount' (have intial flag to see if req.user already set. if set, skip this one)
);

app.post('/auth/facebook/createAccount',
  OAuthController.createAccountUsingCredentialsFrom('facebook'), // grab from req.body, set it to req.user THEN signSendJWT. 
  OAuthController.signSendJWT,
  OAuthController.sendErrorMessage,
);


/**
 * Step 1 of facebook authentication.
 * Redirect user to delegated facebook authentication.
 * NOTE: When you change env.FACEBOOK_REDIRECT_URI, you must also change it in FB App Dashboard. 
 */
const redirectSigninToFacebook = (req, res) => {
  res.redirect(
    `https://www.facebook.com/dialog/oauth?` +
    `client_id=${process.env.FACEBOOK_ID}` +
    `&response_type=code` +
    `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`
  );
};

/**
 * Step 2 of facebook authentication. 
 * If delegated authentication is successful, populate req.oauth.facebook with returned
 * facebook user/profile information and continue to next middleware. 
 */
const obtainCredentialsFromFacebook = (req, res, next) => {
  if (req.query.error_reason && req.query.error_reason === 'user_denied') {
    res.redirect('/signin');
  } else {
    const facebookExchangeCodeForAccessTokenURI = `https://graph.facebook.com/v2.3/oauth/access_token?` +
      `&client_id=${process.env.FACEBOOK_ID}` +
      `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
      `&client_secret=${process.env.FACEBOOK_SECRET}` +
      `&code=${req.query.code}`;

    axios.get(facebookExchangeCodeForAccessTokenURI)
      .then(tokenResponse => {

        const facebookInspectAccessTokenURI = `https://graph.facebook.com/debug_token?` +
          `input_token=${tokenResponse.data.access_token}` +
          `&access_token=${process.env.FACEBOOK_ID}|${process.env.FACEBOOK_SECRET}`;

        axios.get(facebookInspectAccessTokenURI)
          .then(inspectionResponse => {

            /* RF: Must add checks here, this is the entire basis for inspecting the access token on debug_token route.
             */

            const facebookFetchProfileURI = `https://graph.facebook.com` +
              `/me?fields=id,email,first_name,last_name`;

            axios.get(facebookFetchProfileURI, {
                headers: {
                  Authorization: 'Bearer ' + tokenResponse.data.access_token,
                },
              })
              .then(fetchedProfile => {
                req.oauth = {
                  facebook: merge({}, fetchedProfile, access_token: tokenResponse.data.access_token), // Ensure this adds access token!
                };
                next();
              });
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
  Users.findByFacebookId(req.oauth.facebook.id)
    .then(foundFacebookUser => {
      if (foundFacebookUser) {
        req.user = merge({}, foundOAuthUser);
        next();
      }
      .then(Users.findByEmail(req.oauth.facebook.email))
        .then(foundEmailUser => {
          if (foundEmailUser) {
            res.status(200).json('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.');
          } else {
            next();
          }
        });
    });
};


/**
 * Step 4 of facebook authentication. 
 * If the tandard sign-in process has been completed and req.user has been assigned a value, sign and send a
 * JSON Web Token to the client, including relevant user information in the payload. Otherwise, call next middleware. 
 */
// NOT PART OF config!! or.. no i dont think so. 
const jwt = require('jsonwebtoken');
const jwtSecret = 'bolivia'
const signSendJWT = (req, res, next) => {
  if (req.user) {
    const token = jwt.sign({ user: req.user }, jwtSecret);
    res.json({ token: token });
  } else {
    next();
  }
};

/**
 * Step 5 of facebook authentication. 
 * This middleware will only be reached if no existing user accounts have been linked to the facebook authenticated
 * account or email. Now, we send a response to the client which will prompt the client to query the user whether
 * they are the first of a couple to sign up, or for the other user's email. We will also include the current OAuth
 * information to persist it across redirects.  
 */
// NOT PART OF config. RF: Safer way of persisting oauth info???????? 
const queryCoupleStatus = (req, res) => {
  // send a message that FE will recognise and prompt FE to query user regarding if first of couple and other couple email
  res.status(200).json({
    coupleQuery: true,
    oauth: req.oauth, //???? 
  });
};

/**
 * Step 6 of facebook authentication. 
 * This middleware will only be reached if no existing user accounts have been linked to the facebook authenticated
 * account or email. Now, we send a response to the client which will prompt the client to query the user whether
 * they are the first of a couple to sign up, or for the other user's email. We will also include the current OAuth
 * information to persist it across redirects.  
 */
const createAccountUsingCredentialsFromFacebook = (req, res, next) => {
  // assume standarized i.e. we will receive in req.body on the property 'user', and in our token, we send on the property 'user'. 
  if (req.body.user) {
    req.user = merge({}, req.body.user);
    Users.add(req.user)
    next();
  } else {
    res.send('Something went wrong. Please try signing in again.');
  }
};



exports.verifyExistingAccounts = (OAuthProvider) =>
  (req, res, next) => {
    // find by oauth id
    OAuth[OAuthProvider].verifyExistingAccounts(req.oauth[OAuthProvider].id)

    // all this below should also sit in the OAuth part, it's pretty standard. 
    .then(foundOAuthUser => {
        if (foundOAuthUser) {
          req.user = merge({}, foundOAuthUser);
          next();
        } else {
          Users.findByEmail(req.oauth[OAuthProvider].email)
            .then(foundEmailUser => {
              if (foundEmailUser) {
                res.json(`There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.`);
              } else {
                next();
              }
            });
        }
      })
      .catch(err => next(err));
  };

const OAuthController = {
  queryCoupleStatus: queryCoupleStatus,

  redirectSigninTo: {
    facebook: redirectSigninToFacebook,

  },
  obtainCredentialsFrom: {
    facebook: obtainCredentialsFromFacebook,
  },
  verifyNoExistingAccounts: {
    facebook: verifyExistingAccountsFacebook,
    email: verifyExistingAccountsEmail,
  },
  createAccountUsingCredentialsFrom: {
    facebook: createAccountUsingCredentialsFromFacebook,
  },
};

export default OAuthController;
