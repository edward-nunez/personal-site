import React from 'react';

export const GeneralCard = (props) => {
  return (
  <div className='mdl-card header-card dl-shadow--4dp mdl-cell mdl-cell--12-col'>
    <div className='mdl-card__media mdl-color-text--grey-50'>
      <h2 className='my-name'>EDWARD NUNEZ</h2>
      <h4 className='my-title'>FULL STACK DEVELOPER</h4>
    </div>
    <div className='mdl-card__supporting-text'>
        {props.children}
    </div>
  </div>
  )
}