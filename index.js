require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const { authRoute } = require("./src/routes/authRoute");

const app = express();

// Setup middlewares :
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Routes :
app.use("/user/account", authRoute);

// Connect to mongodb database server
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("✅ Successfully connected to mongodb database server.");

    // Run server
    app.listen(process.env.PORT, () => {
      console.log(
        `✅ Server successfully running on ${process.env.PORT} port.`
      );
    });
  })
  .catch((err) =>
    console.error("❌ Couldn't connect to mongodb database server", err)
  );
