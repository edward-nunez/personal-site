import { useState } from 'react';
import PropTypes from 'prop-types';

import InputLabel from './InputLabel';

/**
 * TODO
 */
function Input({ elemType, type, id, placeholder, rows, required, label, index, valid, onChange, onClick }) {
  const Element = elemType === 'textarea' ? 'textarea' : 'input';
  const [touched, setTouched] = useState(false);

  const handleOnChange = (evt) => {
    onChange(evt, index);
  };

  const handleOnClick = (evt) => {
    setTouched(true);

    onClick(evt, index, true);
  };

  const isInvalid = () => {
    if (required && touched) {
      return !valid;
    }

    return false;
  };

  return (
    <>
      {label && <InputLabel id={id} label={label} />}
      <Element
        type={elemType !== 'textarea' ? type : null}
        className={`form-control ${isInvalid() ? 'is-invalid' : ''}`}
        id={id}
        name={id}
        placeholder={placeholder}
        rows={elemType === 'textarea' ? rows || 3 : null}
        required={required}
        onChange={handleOnChange}
        onClick={handleOnClick}
        onSelect={handleOnClick}
      />
    </>
  );
}

Input.propTypes = {
  elemType: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  rows: PropTypes.number,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  valid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  rows: 0,
  valid: null,
  required: false,
};

export default Input;
