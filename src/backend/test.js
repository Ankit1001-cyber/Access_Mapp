const express = require("express");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const router = express.Router();

// Set up Cloudant with credentials from .env
const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY,
});
const cloudant = CloudantV1.newInstance({
  authenticator,
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

// Test route for database connectivity
router.get("/test-db", async (req, res) => {
  try {
    // Fetch the list of databases
    const response = await cloudant.getAllDbs();
    res.status(200).json({ message: "Database connected!", databases: response.result });
  } catch (error) {
    console.error("Database connectivity error:", error);
    res.status(500).json({ error: "Failed to connect to the database." });
  }
});

module.exports = router;
