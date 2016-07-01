
// Duplicate of ABOVE ^^^^^^^^^^ 
// exports.facebookCallback = (req, res, next) => {

//   if (req.query.error_reason && req.query.error_reason === 'user_denied') {
//     res.redirect('/signin');
//   }

//   const facebookExchangeCodeForAccessToken = `https://graph.facebook.com/v2.3/oauth/access_token?` +
//     `&client_id=${process.env.FACEBOOK_ID}` +
//     `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
//     `&client_secret=${process.env.FACEBOOK_SECRET}` +
//     `&code=${req.query.code}`;

//   axios.get(facebookExchangeCodeForAccessToken)
//     .then(tokenResponse => {
//       console.log('++++ Axios tokenResponse.data +++++');
//       console.log(tokenResponse.data);
//       console.log('++++++++++++++++++++++');

//       const facebookInspectAccessToken = `https://graph.facebook.com/debug_token?` +
//         `input_token=${tokenResponse.data.access_token}` +
//         `&access_token=${appid}|${appsecret}`; // may require pipe 

//       axios.get(facebookInspectAccessToken)
//         .then(inspectionResponse => {
//           console.log('++++ Axios inspectionResponse.data +++++');
//           console.log(inspectionResponse.data);
//           console.log('++++++++++++++++++++++');

//           const facebookFetchProfile = `https://graph.facebook.com` +
//             `/me?fields=id,email,first_name,last_name`;
//           // res.send('something..!');
//           axios.get(facebookFetchProfile, {
//               headers: {
//                 Authorization: 'Bearer ' + tokenResponse.data.access_token,
//               },
//             })
//             .then(fetchedProfile => {
//               console.log('++++ Axios fetchedProfile.data +++++');
//               console.log(fetchedProfile.data);
//               console.log('++++++++++++++++++++++');
//               res.send('final step!');
//             });
//         });
//     })
//     .catch(err => console.log(err));
// };
