import React from 'react';
import CheckBox from '../utils/CheckBox';

export default function CityFilterBar() {
  return (
    <div className='flex flex-row m-1 pr-80 justify-evenly gap-14 align-middle items-baseline relative'>
      <CheckBox name='beach' />
      <CheckBox name='ski' />
      <CheckBox name='hide' />
    </div>
  );
}
