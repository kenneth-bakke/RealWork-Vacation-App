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
  const { beachCities, skiCities } = cityData;
  const [beachCityData, setBeachCityData] = useState(beachCities);
  const [skiCityData, setSkiCityData] = useState(skiCities);

  // Only want to run these on load instead of every change of lat or lon
  useEffect(() => {
    getLocation();
    populateCityData(beachCities);
    populateCityData(skiCities);
  }, []);

  useEffect(() => {
    const clearId = setTimeout(() => {
      if (lat && lon) {
        getLocalWeatherDetails();
      }
    }, 400);

    return () => clearTimeout(clearId);
  }, [lat, lon]);

  // Set up
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
    } else {
      alert(
        'Please allow location access to determine your weather conditions'
      );
    }
  };

  const populateCityData = async (cityGroup) => {
    const cityData = [];

    await cityGroup.forEach((city) => {
      getCityWeatherDetails(city.lat, city.lng)
        .then((details) => {
          city.details = details;
          city.reasons = [];
          cityData.push(city);
        })
        .catch((e) => console.log(e.message));
    });

    cityGroup === 'beachCities'
      ? setBeachCityData(cityData)
      : setSkiCityData(cityData);
  };

  // API Calls
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

  const getLocalWeatherDetails = async () => {
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
        setLocalTempFeelsLike(Math.floor(locationData?.current?.feels_like));
      })
      .catch((e) => console.log(e));
  };

  // Rendering
  const renderOptions = () => {
    const [possibleCities, rejectedCities] = filterCities();

    return (
      <div>
        <h2>Here are some recommendations based on your location:</h2>
        {possibleCities.map((city) => {
          return <div>{city}</div>;
        })}
        <h3>We do not recommend these places for your vacation:</h3>
        {rejectedCities.map((city) => {
          return (
            <div>
              {city.name} is {city?.reasons?.map((reason) => reason).join(' ')}
            </div>
          );
        })}
      </div>
    );
  };

  const filterCities = () => {
    let possibleCities = [];
    let rejectedCities = [];

    if (localTemp > 50) {
      rejectedCities = skiCityData;
      beachCityData.forEach((city) => {
        if (city?.details?.alert && city?.details?.alert?.length >= 1) {
          city.reasons.push('Weather Alert');
        }
        if (city?.details?.current?.temp < 70) {
          city.reasons.push('Too cold');
        }
        if (city?.details?.current?.wind_speed > 20) {
          city.reasons.push('Too windy');
        }
        if (city?.details?.current?.weather[0]?.main === 'Clouds') {
          city.reasons.push('Too cloudy');
        }
        if (city?.reasons?.length === 0) {
          possibleCities.push(city);
        }
      });
    } else {
      rejectedCities = beachCityData;
      skiCityData.forEach((city) => {
        if (city?.details?.alert && city.details?.alert?.length >= 1) {
          city.reasons.push('Weather Alert');
          rejectedCities.push(city);
        }
      });
    }

    return [possibleCities, rejectedCities];
  };

  return (
    <main>
      <div>
        <h1>Time for a vacation!</h1>
        <h2>
          Your current temperature is {localTemp ? localTemp : ' '}
          {'\u00B0'} F
        </h2>
        <h2>
          Feels like {localTempFeelsLike ? localTempFeelsLike : ' '}
          {'\u00B0'} F
        </h2>
        {renderOptions()}
      </div>
    </main>
  );
}
