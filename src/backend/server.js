require("dotenv").config();  // Load environment variables at the top
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const { APIStrategy } = require("ibmcloud-appid");
const incidentsRouter = require("./routes/incidents.js");  // Ensure the path and extension are correct
const locationsRouter = require("./routes/locations.js");
const userRouter = require("./routes/user.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// App ID Configuration
passport.use(
  new APIStrategy({
    oauthServerUrl: process.env.APPID_OAUTH_URL,
  })
);
app.use(passport.initialize());

// Secure routes
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
app.use("/api", userRouter); // Public routes for login/register

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`console.log(Server is running on http://localhost:${PORT});`);
});
