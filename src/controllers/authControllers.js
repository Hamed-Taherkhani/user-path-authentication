const UserModel = require("../model/userModel");
const { generateToken } = require("../utilities/token");

module.exports.signup_post = (req, res) => {
  const { f_name, l_name, email, password } = req.body;

  // Try to store user on DB
  UserModel.create({ f_name, l_name, email, password })
    .then((result) => {
      // Generate token based on user id, then set token in cookie
      const token = generateToken({ id: result._id.toString() });
      res.cookie("token", token, {
        maxAge: Number(process.env.TOKEN_EXPIRE_TIME_SECONDS * 1000),
        httpOnly: true,
        // secure: true
      });

      // Filter password and __v properties of user doc
      const { __v, password, ...user } = result._doc;
      res.status(201).json({ user, token });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
      console.error(err);
    });
};

module.exports.login_post = (req, res) => {
  res.send("Login");
};

module.exports.logout_get = (req, res) => {
  res.send("logout");
};
