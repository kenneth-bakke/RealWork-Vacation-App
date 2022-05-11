import React from 'react';
import CheckBox from '../utils/CheckBox';

export default function CityFilterBar() {
  return (
    <div className='category__nav flex flex-row m-1 p-6 justify-evenly align-middle'>
      <CheckBox name='beach' />
      <CheckBox name='ski' />
      <CheckBox name='hide' />
    </div>
  );
}
