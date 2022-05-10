import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './Context/AppContext';
import { cityData } from './static/mockCityData';

const SERVER_URL = 'http://localhost:3001/location/?';

export default function App() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [userLocationData, setUserLocationData] = useState({});
  const [localTemp, setLocalTemp] = useState(0);
  const [localTempFeelsLike, setLocalTempFeelsLike] = useState(0);
  const [beachCitiesData, setBeachCitiesData] = useState(cityData.beachCities);
  const [skiCitiesData, setSkiCitiesData] = useState(cityData.skiCities);
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [rejectedCities, setRejectedCities] = useState([]);

  // Only want to run these on load instead of every change of lat or lon
  useEffect(() => {
    getLocation();
    beachCitiesData.forEach((city) => {
      populateCityData('beachCities', city);
    });
    skiCitiesData.forEach((city) => {
      populateCityData('skiCities', city);
    });
  }, []);

  useEffect(() => {
    const clearId = setTimeout(() => {
      if (lat && lon) {
        getLocalWeatherDetails();
      }
    }, 400);

    return () => clearTimeout(clearId);
  }, [lat, lon]);

  useEffect(() => {
    const clearId = setTimeout(() => {
      if (localTemp) {
        filterCities();
      }
    });

    return () => clearTimeout(clearId);
  }, [localTemp]);

  // Set up
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
    } else {
      alert('Could not determine your weather conditions');
    }
  };

  const populateCityData = async (cityGroup, city) => {
    const cityData = checkLocalStorage(cityGroup);
    if (cityData && cityExists(cityData, city)) {
      if (cityGroup === 'beachCities') {
        setBeachCitiesData(cityData);
      } else {
        setSkiCitiesData(cityData);
      }
    } else {
      await getCityWeatherDetails(city.lat, city.lng).then((details) => {
        const cities = JSON.parse(localStorage.getItem(cityGroup));
        city.details = details;
        city.reasons = [];
        cities.push(city);
        localStorage.setItem(cityGroup, JSON.stringify(cities));
      });
      cityGroup === 'beachCities'
        ? setBeachCitiesData((prev) => {
            prev.forEach((existingCity) => {
              if (existingCity.name === city.name) {
                existingCity = city;
              }
            });
            return prev;
          })
        : setSkiCitiesData((prev) => {
            prev.forEach((existingCity) => {
              if (existingCity.name === city.name) {
                existingCity = city;
              }
            });
            return prev;
          });
    }
  };

  const getLocalWeatherDetails = async () => {
    try {
      const locationData = JSON.parse(localStorage.getItem('userLocationData'));
      if (locationData) {
        setUserLocationData(locationData);
        setLocalTemp(Math.floor(locationData?.current?.temp));
        setLocalTempFeelsLike(Math.floor(locationData?.current?.feels_like));
      } else {
        const locationURL =
          SERVER_URL +
          new URLSearchParams({ lat: lat, lon: lon, units: 'imperial' });

        await fetch(locationURL, {
          method: 'get',
          headers: {
            ContentType: 'application/json',
          },
        })
          .then((res) => res.json())
          .then((locationData) => {
            setUserLocationData(locationData);
            setLocalTemp(Math.floor(locationData?.current?.temp));
            setLocalTempFeelsLike(
              Math.floor(locationData?.current?.feels_like)
            );
            localStorage.setItem(
              'userLocationData',
              JSON.stringify(locationData)
            );
          })
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const getCityWeatherDetails = async (lat, lon) => {
    const locationURL =
      SERVER_URL +
      new URLSearchParams({ lat: lat, lon: lon, units: 'imperial' });

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

  const filterCities = () => {
    let possibleCities = [];
    let notPossibleCities = [];

    if (localTemp > 50) {
      beachCitiesData.forEach((city) => {
        if (city?.details?.alert && city?.details?.alert?.length >= 1) {
          if (!contains(city.reasons, 'currently under a weather alert')) {
            city?.reasons?.push('currently under a weather alert');
          }
        }
        if (city?.details?.current?.temp < 70) {
          if (!contains(city.reasons, 'too cold')) {
            city?.reasons?.push('too cold');
          }
        }
        if (city?.details?.current?.wind_speed > 20) {
          if (!contains(city.reasons, 'too windy')) {
            city?.reasons?.push('too windy');
          }
        }
        if (city?.details?.current?.weather[0]?.main === 'Clouds') {
          if (!contains(city.reasons, 'too cloudy')) {
            city?.reasons?.push('too cloudy');
          }
        }
        if (city?.reasons?.length === 0) {
          possibleCities.push(city);
        } else {
          notPossibleCities.push(city);
        }
      });
      skiCitiesData.forEach((city) => {
        if (!contains(city.reasons, 'too warm')) {
          city?.reasons?.push('too warm');
        }
        notPossibleCities.push(city);
      });
    } else {
      skiCitiesData.forEach((city) => {
        if (city?.details?.alert && city.details?.alert?.length >= 1) {
          if (!contains(city.reasons, 'currently under a weather alert')) {
            city.reasons.push('currently under a weather alert');
          }
          notPossibleCities.push(city);
        } else {
          possibleCities.push(city);
        }
      });
      beachCitiesData.forEach((city) => {
        if (!contains(city.reasons, 'too cold')) {
          city.reasons.push('too cold');
        }
        notPossibleCities.push(city);
      });
    }

    setRecommendedCities(possibleCities);
    setRejectedCities(notPossibleCities);
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

  // Rendering
  const renderOptions = () => {
    return (
      <div className='p-8 m-10'>
        <h2 className='font-semibold text-lg p-px mx-auto'>
          Cities with beaches
        </h2>
        {renderBeachCities()}
        <h2 className='font-semibold text-lg p-px mx-auto'>
          Skiing Destinations
        </h2>
        {renderSkiCities()}
      </div>
    );
  };

  const renderBeachCities = () => {
    return beachCitiesData.map((city) => {
      return (
        <div
          className='flex flex-row items-baseline p-px m-auto'
          key={city.name + city.lat + ',' + city.lng}
        >
          <div className='flex flex-col items-left p-px'>
            <h3 className='font-semibold'>{city?.name}:</h3>
            current temp: {city?.details?.current?.temp}
            {`\u00b0`}F
            <span>
              current wind speed: {city?.details?.current?.wind_speed}
            </span>
          </div>
        </div>
      );
    });
  };

  const renderSkiCities = () => {
    return skiCitiesData.map((city) => {
      return (
        <div
          className='flex flex-row items-baseline p-px'
          key={city.name + city.lat + ',' + city.lng}
        >
          <div className='flex flex-col items-left p-px'>
            <h3 className='font-semibold'>{city?.name}:</h3>
            current temp: {city?.details?.current?.temp}
            {`\u00b0`}F
            <span>
              current wind speed: {city?.details?.current?.wind_speed}
            </span>
          </div>
        </div>
      );
    });
  };

  const renderSuggestions = () => {
    return (
      <div className='flex flex-row items-stretch mx-auto p-8'>
        {renderOptions()}
        <div className='p-8 m-10'>
          <h2 className='font-semibold text-lg'>
            Here are some recommendations based on your location:
          </h2>
          {renderRecommendedCities()}
        </div>
        <div className='p-8 m-10'>
          <h2 className='font-semibold text-lg'>
            We do not recommend these places for your vacation:
          </h2>
          {renderRejectedCities()}
        </div>
      </div>
    );
  };

  const renderRecommendedCities = () => {
    return recommendedCities.map((city) => {
      return (
        <div
          className='flex flex-row items-baseline p-px m-auto'
          key={city.name + city.lat + ',' + city.lng}
        >
          <h3 className='font-semibold'>{city.name}</h3>
        </div>
      );
    });
  };

  const renderRejectedCities = () => {
    return rejectedCities.map((city) => {
      return (
        <div
          className='flex flex-row items-baseline p-px m-auto'
          key={city.name + city.lat + ',' + city.lng}
        >
          <span>
            <h3 className='font-semibold'>{city.name}</h3> It's{' '}
            {city.reasons.map((reason) => reason.toString()).join(' and ')}
          </span>
        </div>
      );
    });
  };

  return (
    <main>
      <div className='items-center container mx-auto p-8 m-10'>
        <div className='flex flex-col items-center text-xl'>
          <h1>Time for a vacation!</h1>
          <h2>
            The current temperature in your area is{' '}
            {localTemp ? localTemp : ' '}
            {'\u00B0'} F
          </h2>
          <h3>
            The temperature feels like{' '}
            {localTempFeelsLike ? localTempFeelsLike : ' '}
            {'\u00B0'} F
          </h3>
        </div>
        <div className='flex flex-row items-stretch container mx-auto p-8'>
          {renderSuggestions()}
        </div>
      </div>
    </main>
  );
}
