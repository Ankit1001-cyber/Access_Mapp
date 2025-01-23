const express = require("express");
const router = express.Router();
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY,
});
const cloudant = CloudantV1.newInstance({
  authenticator,
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

router.post("/", async (req, res, next) => {
  const { latitude, longitude, type, description } = req.body;
  const document = {
    latitude,
    longitude,
    type,
    description,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await cloudant.postDocument({
      db: "locations",
      document,
    });
    res.status(201).json({ id: response.result.id, rev: response.result.rev });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const response = await cloudant.postAllDocs({
      db: "locations",
      includeDocs: true,
    });

    const locations = response.result.rows.map((row) => ({
      id: row.id,
      ...row.doc,
    }));
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existingDoc = await cloudant.getDocument({
      db: "locations",
      docId: req.params.id,
    });

    await cloudant.deleteDocument({
      db: "locations",
      docId: req.params.id,
      rev: existingDoc.result._rev,
    });

    res.status(204).send();
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ error: "Location not found" });
    } else {
      next(error);
    }
  }
});

module.exports = router;
