const jwt = require('jwt-simple');

module.exports = function (req, res, next) {

  //validate token
  try {
    let token = req.headers['x-access-token'];
    let secret = 'zzggzz';
    let decoded = jwt.decode(token, secret);

    console.log("Token=" + token);

    if (decoded.exp <= Date.now()) {
      console.log("Access token has expired");
      res.ok({
        text: "Access token has expired"
      });
    } else {
      //valid token
      res.locals.decoded = decoded;
      next();
    }
  } catch (error) {
    //decode failed, jwt.decode throw an error
    console.log(error);
    res.ok({
      text: "something went wrong" + error
    })
  }
};
