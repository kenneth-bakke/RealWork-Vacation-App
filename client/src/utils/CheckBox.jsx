import React, { useState, useContext } from 'react';
import AppContext from '../Context/AppContext';
import { capitalize } from './utils';

export default function CheckBox({ name }) {
  const [isChecked, setIsChecked] = useState(name === 'hide' ? false : true);
  const { showUnrecommended, setShowUnrecommended } = useContext(AppContext);

  const toggleChecked = () => {
    setIsChecked(!isChecked);
    setShowUnrecommended(isChecked);
  };

  return (
    <div onChange={name === 'hide' ? toggleChecked : null}>
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
