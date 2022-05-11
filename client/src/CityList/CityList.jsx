import React from 'react';
import CityCard from './CityCard';

export default function CityList({ cities }) {
  return (
    <>
      <div className='flex flex-wrap -m-3 p-px m-auto'>
        {cities?.map((city) => {
          return (
            <CityCard
              name={city?.name}
              temp={city?.details?.current?.temp}
              wind={city?.details?.current?.wind_speed}
              reasons={city?.reasons}
              key={city?.name + city?.lat + ',' + city?.lng}
            />
          );
        })}
      </div>
    </>
  );
}
