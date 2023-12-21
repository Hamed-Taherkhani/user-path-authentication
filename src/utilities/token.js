const { sign } = require("jsonwebtoken");

const generateToken = (payload) => {
  return sign(
    { ...payload, random: Math.random() * 20000 },
    process.env.JWT_SECRET,
    {
      expiresIn: Number(process.env.TOKEN_EXPIRE_TIME_SECONDS),
    }
  );
};

module.exports = {
  generateToken,
};
