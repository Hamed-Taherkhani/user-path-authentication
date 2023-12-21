const { compareSync } = require("bcrypt");
const UserModel = require("../model/userModel");
const { generateToken } = require("../utilities/token");
const { isLoginSchemaValid } = require("../schema/loginSchema");

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

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  if (await isLoginSchemaValid({ email, password })) {
    let user = null;

    // Try to find user by email
    try {
      user = await UserModel.findOne({ email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong on server!" });
    }

    // If user found
    if (user) {
      // If password matched
      if (compareSync(password, user.password)) {
        // Generate and send token to client
        const token = generateToken({ id: user._id.toString() });
        res.cookie("token", token, {
          maxAge: Number(process.env.TOKEN_EXPIRE_TIME_SECONDS * 1000),
          httpOnly: true,
          // secure: true
        });

        const { __v, password, ...filteredUser } = user._doc;
        res.status(200).json({ user: filteredUser, token });
      } else {
        res.status(400).json({ message: "Invalid email or password!" });
      }
    } else {
      res
        .status(400)
        .json({ message: "You haven't account! Please register first!" });
    }
  } else {
    res.status(400).json({ message: "Invalid email or password!" });
  }
};

module.exports.logout_get = (req, res) => {
  res.send("logout");
};
