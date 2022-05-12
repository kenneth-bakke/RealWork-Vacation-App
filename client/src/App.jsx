import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from './Context/AppContext';
import CityList from './CityList/CityList';
import CityFilterBar from './CityList/CityFilterBar';
import CheckBox from './utils/CheckBox';
import { cityData } from './static/mockCityData';
import {
  cityExists,
  contains,
  getCityWeatherDetails,
  getLocalWithExpiry,
  storeLocalWithExpiry,
  hasWeatherWarning,
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
  const [showBeach, setShowBeach] = useState(true);
  const [showSki, setShowSki] = useState(true);

  const LOCAL_STORAGE_TTL_MS = 3600 * 1000;

  // Only want to run these on load instead of every change of lat or lon
  useEffect(() => {
    const clearId = setTimeout(() => {
      getLocation();
      beachCitiesData?.forEach((city) => {
        populateCityData('beachCities', city);
      });
      skiCitiesData?.forEach((city) => {
        populateCityData('skiCities', city);
      });
    }, 400);

    return () => clearTimeout(clearId);
  }, []);

  useEffect(() => {
    const clearId = setTimeout(() => {
      getLocalWeatherDetails();
    }, 400);

    return () => clearTimeout(clearId);
  }, [lat, lon]);

  useEffect(() => {
    const clearId = setTimeout(() => {
      filterCities();
    }, 400);

    return () => clearTimeout(clearId);
  }, [beachCitiesData, skiCitiesData]);

  const getLocation = () => {
    try {
      const storedLocationData = getLocalWithExpiry('userLocationData');
      if (!storedLocationData) {
        updateLocalCoordinates();
      } else {
        setLat(storedLocationData.lat);
        setLon(storedLocationData.lon);
        if (!storedLocationData.lat && !storedLocationData.lon) {
          updateLocalCoordinates();
        }
        setUserLocationData(storedLocationData);
        setLocalTemp(Math.floor(storedLocationData?.current?.temp));
        setLocalTempFeelsLike(
          Math.floor(storedLocationData?.current?.feels_like)
        );
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateLocalCoordinates = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        getLocalWeatherDetails();
      });
    } else {
      alert('Could not determine your weather conditions');
    }
  };

  const getLocalWeatherDetails = async () => {
    try {
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
          storeLocalWithExpiry(
            'userLocationData',
            locationData,
            LOCAL_STORAGE_TTL_MS
          );
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e.message);
    }
  };

  const populateCityData = async (cityGroup, city) => {
    try {
      const cityGroupData = getLocalWithExpiry(cityGroup);
      if (cityGroupData) {
        if (cityExists(cityGroupData, city)) {
          updateCityDataState(cityGroup, cityGroupData);
        } else {
          await updateCityData(cityGroup, city);
        }
      } else {
        await updateCityData(cityGroup, city);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateCityData = async (cityGroup, city) => {
    await getCityWeatherDetails(city.lat, city.lng)
      .then((details) => {
        city.details = details;
        city.type = cityGroup === 'beachCities' ? 'beach' : 'ski';
        city.reasons = [];
        updateCityDataState(cityGroup, city);
        if (cityGroup === 'beachCities') {
          storeLocalWithExpiry(
            cityGroup,
            beachCitiesData,
            LOCAL_STORAGE_TTL_MS
          );
        } else {
          storeLocalWithExpiry(cityGroup, skiCitiesData, LOCAL_STORAGE_TTL_MS);
        }
      })
      .catch((e) => console.log(e.message));
  };

  const updateCityDataState = (cityGroup, cityData) => {
    if (cityGroup === 'beachCities') {
      setBeachCitiesData(cityData);
    } else {
      setSkiCitiesData(cityData);
    }
    // if (cityGroup === 'beachCities') {
    //   if (beachCitiesData.includes(cityData)) {
    //     const indexOfOldCityData = beachCitiesData.indexOf(cityData);
    //     const prevBeachCitiesData = [...beachCitiesData];
    //     prevBeachCitiesData[indexOfOldCityData] = cityData;
    //     setBeachCitiesData(prevBeachCitiesData);
    //   } else {
    //     setBeachCitiesData((prevBeachCities) => [...prevBeachCities, cityData]);
    //   }
    // } else {
    //   if (skiCitiesData.includes(cityData)) {
    //     const indexOfOldCityData = skiCitiesData.indexOf(cityData);
    //     const prevSkiCitiesData = [...skiCitiesData];
    //     prevSkiCitiesData[indexOfOldCityData] = cityData;
    //     setSkiCitiesData(prevSkiCitiesData);
    //   } else {
    //     setSkiCitiesData((prevSkiCities) => [...prevSkiCities, cityData]);
    //   }
    // }
  };

  const filterCities = () => {
    if (beachCitiesData && beachCitiesData.length > 0) {
      beachCitiesData?.forEach((city) => {
        if (!city.details) return;
        if (!city.reasons) city.reasons = [];
        if (hasWeatherWarning(city)) {
          city.reasons?.push('has weather warning');
        }
        if (city?.details?.current?.temp < 70) {
          city.reasons?.push('too cold');
        }
        if (city?.details?.current?.wind_speed > 20) {
          city.reasons?.push('too windy');
        }
        if (
          city?.details?.current?.weather[0]?.description?.includes('cloud')
        ) {
          city.reasons?.push('too cloudy');
        }

        sortCity(city);
      });
    }
    if (skiCitiesData && skiCitiesData.length > 0) {
      skiCitiesData?.forEach((city) => {
        if (!city.details) return;
        if (!city.reasons) city.reasons = [];
        if (hasWeatherWarning(city)) {
          city?.reasons?.push('has weather warning');
        }
        if (city?.details?.current?.temp > 50) {
          city?.reasons?.push('too warm for skiing');
        }

        sortCity(city);
      });
    }
  };

  const sortCity = (city) => {
    if (city?.reasons?.length > 0) {
      if (rejectedCities.includes(city)) {
        const indexOfOldVersion = rejectedCities.indexOf(city);
        const prevRejectedCities = [...rejectedCities];
        prevRejectedCities[indexOfOldVersion] = city;
        setRejectedCities(prevRejectedCities);
      } else {
        setRejectedCities((prevRejected) => [...prevRejected, city]);
      }
    } else {
      if (recommendedCities.includes(city)) {
        const indexOfOldVersion = recommendedCities.indexOf(city);
        const prevRecommendedCities = [...recommendedCities];
        prevRecommendedCities[indexOfOldVersion] = city;
        setRejectedCities(prevRecommendedCities);
      } else {
        setRecommendedCities((prevRecommended) => [...prevRecommended, city]);
      }
    }
  };

  //-------- JSX Rendering --------//
  const renderHeader = () => {
    return (
      <header className='z-50 fixed pt-16 pl-16 bg-white w-full'>
        <div className='flex flex-row items-end justify-start text-xl first-letter p-px m-auto border-b-2'>
          <img className='max-h-10 max-w-10' src='plane.svg' alt='plane logo' />
          <h1 className='text-2xl font-semibold'>
            Your next vacation is a click away
          </h1>
        </div>
        <div className='left-20 flex flex-col flex-wrap items-left text-sm p-px m-1'>
          <h2>
            Current temperature: {localTemp ? localTemp : ' '}
            {'\u00B0'} F The temperature feels like:{' '}
            {localTempFeelsLike ? localTempFeelsLike : ' '}
            {'\u00B0'} F
          </h2>
        </div>
        <p>
          <strong>Location type</strong>
        </p>
        <CityFilterBar />
      </header>
    );
  };

  const renderCityGrid = () => {
    return (
      <>
        <div className='grid-cols-6'>
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
    <div className='flex flex-row'>
      <AppContext.Provider
        value={{
          showUnrecommended,
          setShowUnrecommended,
          showBeach,
          setShowBeach,
          showSki,
          setShowSki,
        }}
      >
        {renderHeader()}
        <main>
          <div className='items-center container mx-auto p-9 m-20'>
            <div className='flex flex-row items-stretch container mx-auto p-24'>
              {renderCityGrid()}
            </div>
          </div>
        </main>
      </AppContext.Provider>
    </div>
  );
}
