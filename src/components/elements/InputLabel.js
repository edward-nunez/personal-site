import React from 'react';
import PropTypes from 'prop-types';

function InputLabel({ id, children }) {
  return (
    <label htmlFor={id} className="form-label">
      {children}
    </label>
  );
}

InputLabel.propTypes = {
  id: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
};

export default InputLabel;
