const API_KEY = process.env.OPEN_WEATHER_KEY;
const API = process.env.OPEN_WEATHER_API;

module.exports = {
  getLocation: async function (req, res) {
    const { lat, lon, part } = req.query;
    const API_URL = part
      ? `${API}lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_KEY}`
      : `${API}lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(API_URL);

    if (response.ok) {
      const data = await res.json();

      try {
        res.status(200).send(text);
      } catch (e) {
        res.status(404).send('Oopsie');
      }
    }
  },
};
