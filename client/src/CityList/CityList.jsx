import React from 'react';
import CityCard from './CityCard';

export default function CityList({ cities }) {
  return (
    <>
      {/* <div className='flex flex-wrap m-3 p-px min-h-150 max-w-xs'> */}
      <div className='flex flex-wrap -m-3'>
        {cities?.map((city) => {
          return (
            <CityCard
              name={city?.name}
              type={city?.type}
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
