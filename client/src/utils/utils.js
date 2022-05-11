const SERVER_URL = 'http://localhost:3001/location/?';

const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const cityExists = (cityData, city) => {
  for (let i = 0; i < cityData.length; i++) {
    const existingCity = cityData[i];
    if (existingCity.name === city.name) {
      return true;
    }
  }

  return false;
};

const contains = (reasons, reason) => {
  for (let i = 0; i < reasons?.length; i++) {
    if (reasons[i] === reason) return true;
  }
  return false;
};

const getLocalWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const storeLocalWithExpiry = (key, value, ttl) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

const getCityWeatherDetails = async (lat, lon) => {
  const locationURL =
    SERVER_URL + new URLSearchParams({ lat: lat, lon: lon, units: 'imperial' });

  const response = await fetch(locationURL, {
    method: 'get',
    headers: {
      ContentType: 'application/json',
    },
  });

  try {
    const cityWeatherDetails = response.json();
    return cityWeatherDetails;
  } catch (e) {
    console.log(e.message);
  }
};

const hasWeatherWarning = (city) => {
  return city?.alert && city?.alert?.length > 0;
};

module.exports = {
  capitalize: capitalize,
  cityExists: cityExists,
  contains: contains,
  getCityWeatherDetails: getCityWeatherDetails,
  getLocalWithExpiry: getLocalWithExpiry,
  hasWeatherWarning: hasWeatherWarning,
  storeLocalWithExpiry: storeLocalWithExpiry,
  SERVER_URL: SERVER_URL,
};
