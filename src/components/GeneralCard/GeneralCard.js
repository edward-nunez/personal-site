import React from 'react';

export const GeneralCard = (props) => {
  return (
  <div className='mdl-card header-card dl-shadow--4dp mdl-cell mdl-cell--12-col'>
    <div className='mdl-card__media mdl-color-text--grey-50'>
      <h2 className='my-name'>EDWARD NUNEZ</h2>
      <div className='my-title'><b>FU<span>LL</span> ST<span>A</span>CK <span>DEV</span>ELOPER</b></div>
    </div>
    {props.children}
  </div>
  )
}