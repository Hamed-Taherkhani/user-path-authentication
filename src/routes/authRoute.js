const { Router } = require("express");
const authControllers = require("../controllers/authControllers");

const route = Router();

route.post("/signup", authControllers.signup_post);
route.post("/login", authControllers.login_post);
route.get("/logout", authControllers.logout_get);

module.exports = {
  authRoute: route,
};
