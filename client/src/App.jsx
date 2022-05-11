import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from './Context/AppContext';
import CityList from './CityList/CityList';
import CheckBox from './utils/CheckBox';
import { cityData } from './static/mockCityData';
import {
  cityExists,
  contains,
  checkLocalStorage,
  getCityWeatherDetails,
  SERVER_URL,
} from './utils/utils';

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
  const [showUnrecommended, setShowUnrecommended] = useState(true);

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

  const renderHeader = () => {
    return (
      <header className='border-b-2'>
        <div className='flex flex-row items-end justify-start text-xl first-letter p-px m-3 '>
          <img className='max-h-10 max-w-10' src='plane.svg' alt='plane logo' />
          <h1 className='text-2xl font-semibold'>
            Your next vacation is a click away
          </h1>
        </div>
      </header>
    );
  };

  const renderCityGrid = () => {
    return (
      <>
        <div id='city grid component'>
          <div className='col-xs-12'>
            <p>
              <strong>Location type</strong>
            </p>
            <div className='category__nav flex flex-row m-auto p-5 justify-evenly align-middle relative'>
              <CheckBox name='beach' />
              <CheckBox name='skiing' />
              <CheckBox name='hide' />
            </div>
          </div>
          {renderCities(recommendedCities)}
          {showUnrecommended ? renderCities(rejectedCities) : null}
        </div>
      </>
    );
  };

  const renderCities = (cities) => {
    return <CityList cities={cities} />;
  };

  return (
    <div>
      <AppContext.Provider value={{ showUnrecommended, setShowUnrecommended }}>
        {renderHeader()}
        <main>
          <div className='left-20 flex flex-col flex-wrap items-left text-sm p-px m-1'>
            <h2>
              Current temperature: {localTemp ? localTemp : ' '}
              {'\u00B0'} F The temperature feels like:{' '}
              {localTempFeelsLike ? localTempFeelsLike : ' '}
              {'\u00B0'} F
            </h2>
          </div>
          <div className='items-center container mx-auto p-8 m-10'>
            <div className='flex flex-row items-stretch container mx-auto p-8'>
              {recommendedCities.length > 0 ? renderCityGrid() : null}
            </div>
          </div>
        </main>
      </AppContext.Provider>
    </div>
  );
}
