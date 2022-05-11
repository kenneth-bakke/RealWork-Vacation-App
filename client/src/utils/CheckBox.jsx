import React, { useState, useContext } from 'react';
import AppContext from '../Context/AppContext';
import { capitalize } from './utils';

export default function CheckBox({ name }) {
  const [isChecked, setIsChecked] = useState(name === 'hide' ? false : true);
  const {
    showUnrecommended,
    setShowUnrecommended,
    showBeach,
    setShowBeach,
    showSki,
    setShowSki,
  } = useContext(AppContext);

  const toggleChecked = () => {
    setIsChecked(!isChecked);
    if (name === 'hide') {
      setShowUnrecommended(!showUnrecommended);
    } else if (name === 'beach') {
      setShowBeach(!showBeach);
    } else if (name === 'ski') {
      setShowSki(!showSki);
    }
  };

  return (
    <div
      onChange={toggleChecked}
      className='flex flex-row border-grey-light text-grey h-6 w-6 p-2 m-1 items-baseline rounded static inline-block'
    >
      <input
        type='checkbox'
        name={name}
        value={name}
        defaultChecked={isChecked}
      />
      <label htmlFor={name}>
        {name === 'hide' ? 'Hide unrecommended' : capitalize(name)}
      </label>
    </div>
  );
}
