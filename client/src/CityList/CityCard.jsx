import React, { useState, useContext } from 'react';
import AppContext from '../Context/AppContext';

export default function CityCard({ name, type, temp, wind, reasons }) {
  const [isRecommended, setIsRecommended] = useState(reasons.length === 0);
  const { showSki, showBeach } = useContext(AppContext);

  // if this card is type beach and showBeach is true
  // display it
  // else if this card is type ski and showSki is true
  // display it
  // else
  // don't display anything
  if ((type === 'beach' && showBeach) || (type === 'ski' && showSki)) {
    return (
      <div className={`w-full sm:w-1/2 md:w-1/3 flex flex-col p-3 `}>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col'>
          <div className='p-4 flex-1 flex flex-col'>
            <a href='#'></a>
            <h3 className='mb-4 text-2xl'>{name}</h3>
            <div className={`mb-4  text-sm flex-1 flex-row`}>
              current temp: {temp}
              {`\u00b0`}F current wind speed: {wind} mph
            </div>
            <a
              href='#'
              className={`border-t border-grey-light pt-2 text-xs ${
                !isRecommended ? 'text-red-600' : 'text-grey-400'
              } uppercase no-underline tracking-wide`}
            >
              {isRecommended
                ? 'Recommended'
                : 'Not recommended. ' +
                  reasons.map((reason) => reason).join(' and ')}
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
