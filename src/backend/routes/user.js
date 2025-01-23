const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const passport = require('passport');

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY,
});
const cloudant = CloudantV1.newInstance({
  authenticator,
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const document = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const response = await cloudant.postDocument({
      db: 'users',
      document,
    });
    res.status(201).json({ id: response.result.id, rev: response.result.rev });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const response = await cloudant.postFind({
      db: 'users',
      selector: { email },
    });

    if (response.result.docs.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = response.result.docs[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', passport.authenticate('appid-strategy', { session: false }), (req, res) => {
  res.json(req.user); // req.user is populated by App ID middleware
});

router.put('/profile', passport.authenticate('appid-strategy', { session: false }), async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  try {
    const response = await cloudant.postFind({
      db: 'users',
      selector: { _id: user._id },
    });

    if (response.result.docs.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingUser = response.result.docs[0];

    const updatedUser = {
      ...existingUser,
      name: name || existingUser.name,
      email: email || existingUser.email,
      updatedAt: new Date().toISOString(),
    };

    const updateResponse = await cloudant.putDocument({
      db: 'users',
      docId: existingUser._id,
      document: updatedUser,
    });

    res.json({ id: updateResponse.result.id, rev: updateResponse.result.rev });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
