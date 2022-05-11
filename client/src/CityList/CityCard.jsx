import React, { useState } from 'react';

export default function CityCard({ name, temp, wind, reasons, show }) {
  const [isRecommended, setIsRecommended] = useState(reasons.length === 0);

  return (
    <div
      className={`w-full sm:w-1/2 md:w-1/3 flex flex-col p-3 min-w-450 min-h-125${
        isRecommended ? 'text-black' : 'text-grey-300'
      }`}
    >
      <div className='bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col'>
        <div className={`p-4 flex-1 flex flex-col`}>
          <h3 className='mb-4 text-2xl'>{name}</h3>
          <div className={`mb-4  text-sm flex-1 flex-row`}>
            current temp: {temp}
            {`\u00b0`}F current wind speed: {wind} mph
          </div>
          <a
            href='#'
            className={`border-t border-grey-light pt-2 text-xs ${
              !isRecommended ? 'text-red' : 'text-grey-400'
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
}
