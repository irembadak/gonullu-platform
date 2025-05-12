const Organization = require('../models/Organization');

exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};