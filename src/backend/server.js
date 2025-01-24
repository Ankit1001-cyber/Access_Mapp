require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const { APIStrategy } = require("ibmcloud-appid");
const incidentsRouter = require("./routes/incident");
const locationsRouter = require("./routes/location");
const userRouter = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

passport.use(
  new APIStrategy({
    oauthServerUrl: process.env.APPID_OAUTH_URL,
  })
);
app.use(passport.initialize());

app.use(
  "/api/locations",
  passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }),
  locationsRouter
);
app.use(
  "/api/incidents",
  passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }),
  incidentsRouter
);
app.use("/api", userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
