const API_KEY = process.env.OPEN_WEATHER_KEY;
const API = process.env.OPEN_WEATHER_API;
const NODE_VERSION = process.versions.node.split('.')[0];

const axios = require('axios');

// For Mock calls only, remove when client is linked
const { faker } = require('@faker-js/faker');
const { address } = faker;
const mockLocation = {
  lat: address.latitude(),
  lon: address.longitude(),
  part: '',
};

module.exports = {
  getLocation: async function (req, res) {
    // const { lat, lon, part } = req.query;
    const { lat, lon, part } = mockLocation;
    const API_URL =
      API +
      new URLSearchParams({ lat: lat, lon: lon, part: part, appid: API_KEY });

    const response = await axios.get(API_URL);

    try {
      const { data } = response;
      res.status(response.status).send(data);
    } catch (e) {
      res.status(response.status).send(e);
    }
  },
};
