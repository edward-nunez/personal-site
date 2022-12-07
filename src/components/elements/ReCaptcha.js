import React from 'react';
import PropTypes from 'prop-types';

import ReCAPTCHA from 'react-google-recaptcha';

/**
 * Simple ReCAPTCHA to prevent bots and spammers from abusing functionality.
 *
 * @param TODO
 */
function ReCaptcha({ updateValid }) {
  const handleValidChange = (valid) => {
    if (valid !== null) {
      updateValid(true); // True if value has valid captcha response stored
    } else {
      updateValid(false); // False if value is null for no valid captcha response
    }
  };

  return <ReCAPTCHA sitekey="6LeFmQkTAAAAAIwpph9vOJU7yCZQ2mAWb25B-VET" onChange={handleValidChange} />;
}

ReCaptcha.propTypes = {
  updateValid: PropTypes.func.isRequired,
};

export default ReCaptcha;
