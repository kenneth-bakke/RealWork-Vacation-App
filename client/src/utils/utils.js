const SERVER_URL = 'http://localhost:3001/location/?';

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
  for (let i = 0; i < reasons.length; i++) {
    if (reasons[i] === reason) return true;
  }
  return false;
};

const checkLocalStorage = (key) => {
  try {
    const storageData = localStorage.getItem(key);
    if (storageData) {
      return JSON.parse(storageData);
    } else {
      localStorage.setItem(key, '[]');
      return null;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  }
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

module.exports = {
  cityExists: cityExists,
  contains: contains,
  checkLocalStorage: checkLocalStorage,
  getCityWeatherDetails: getCityWeatherDetails,
  SERVER_URL: SERVER_URL,
};
