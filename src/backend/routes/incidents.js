const express = require('express');
const multer = require('multer');
const router = express.Router();
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY,
});
const cloudant = CloudantV1.newInstance({
  authenticator,
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.array('images'), async (req, res, next) => {
  const { description, location } = req.body;
  const images = req.files.map(file => ({
    path: file.path,
    filename: file.filename,
  }));

  const document = {
    description,
    location: JSON.parse(location),
    images,
    createdAt: new Date().toISOString(),
    votes: { true: 0, false: 0 }
  };

  try {
    const response = await cloudant.postDocument({
      db: 'incidents',
      document,
    });
    res.status(201).json({ id: response.result.id, rev: response.result.rev });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await cloudant.postAllDocs({
      db: 'incidents',
      includeDocs: true,
    });

    const incidents = response.result.rows.map((row) => ({
      id: row.id,
      ...row.doc,
    }));
    res.json(incidents);
  } catch (error) {
    next(error);
  }
});

router.post('/vote/:id', async (req, res, next) => {
  const { id } = req.params;
  const { vote } = req.body; // 'true' or 'false'

  try {
    const response = await cloudant.getDocument({
      db: 'incidents',
      docId: id,
    });

    const incident = response.result;
    incident.votes[vote] += 1;

    if (incident.votes.true > 5) {
      // Automatically mark the incident on the map
      const newMarker = {
        latitude: incident.location.latitude,
        longitude: incident.location.longitude,
        type: 'incident',
        description: incident.description,
        createdAt: new Date().toISOString(),
      };

      await cloudant.postDocument({
        db: 'locations',
        document: newMarker,
      });
    }

    const updateResponse = await cloudant.putDocument({
      db: 'incidents',
      docId: id,
      document: incident,
    });

    res.json({ votes: incident.votes });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
