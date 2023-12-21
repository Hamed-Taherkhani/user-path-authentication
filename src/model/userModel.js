const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator/validator");
const { hash } = require("bcrypt");

const userSchema = new mongoose.Schema({
  f_name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  l_name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  password: {
    type: String,
    validate: {
      validator: isStrongPassword,
      message: "Password is weak!",
    },
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: isEmail,
      message: "Email is not valid!",
    },
    unique: true,
    required: true,
  },
});

userSchema.pre("save", async function () {
  this.password = await hash(this.password, 10);
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
