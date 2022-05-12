const API_KEY = process.env.OPEN_WEATHER_KEY;
const API = process.env.OPEN_WEATHER_API;
const NODE_VERSION = process.versions.node.split('.')[0];

const axios = require('axios');

var cache = {};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = {
  getLocation: async function (req, res) {
    const { lat, lon, part, exclude, units, lang } = req.query;

    const API_URL =
      API +
      new URLSearchParams({
        lat: lat,
        lon: lon,
        part: part,
        exclude: exclude,
        units: units,
        lang: lang,
        appid: API_KEY,
      });

    if (isEmpty(cache) || !cache[lat + lon]) {
      try {
        const response = await axios.get(API_URL);
        const { data } = response;
        cache[lat + ',' + lon] = data;
        res.status(response.status).send(JSON.stringify(data));
      } catch (e) {
        res.status(400).send(e);
      }
    } else {
      res.status(200).send(JSON.stringify(cache));
    }
  },
};
