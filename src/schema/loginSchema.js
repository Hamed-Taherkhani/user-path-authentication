const Joi = require("joi");
const { isEmail, isStrongPassword } = require("validator");

const loginSchema = Joi.object({
  email: Joi.string().required().custom(isEmail),
  password: Joi.string().required().custom(isStrongPassword),
}).required();

const isLoginSchemaValid = async (value) => {
  try {
    await loginSchema.validateAsync(value);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

isLoginSchemaValid({
  email: "hamed@gmail.com",
  password: "124kadfj*G&32",
});

module.exports = {
  loginSchema,
  isLoginSchemaValid,
};
