import { useState } from 'react';
import PropTypes from 'prop-types';

import InputLabel from './InputLabel';

function Input({
  elemType,
  type = 'text',
  id,
  placeholder,
  rows = 0,
  required = false,
  label,
  index,
  valid = null,
  updateInputState,
}) {
  const Element = elemType === 'textarea' ? 'textarea' : 'input';
  const [touched, setTouched] = useState(false);

  const handleOnChange = (evt) => {
    updateInputState(evt, index);
  };

  const handleOnClick = (evt) => {
    setTouched(true);

    updateInputState(evt, index, true);
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
  updateInputState: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  rows: 0,
  required: false,
  valid: null,
};
export default Input;
