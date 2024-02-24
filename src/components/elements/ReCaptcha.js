import PropTypes from 'prop-types';

import ReCAPTCHA from 'react-google-recaptcha';

function ReCaptcha({ updateReCaptchaState }) {
  const handleOnChange = (valid) => {
    if (valid !== null) {
      updateReCaptchaState(true); // True if value has valid captcha response stored
    } else {
      updateReCaptchaState(false); // False if value is null for no valid captcha response
    }
  };

  return <ReCAPTCHA sitekey="6LeFmQkTAAAAAIwpph9vOJU7yCZQ2mAWb25B-VET" onChange={handleOnChange} />;
}

ReCaptcha.propTypes = {
  updateReCaptchaState: PropTypes.func.isRequired,
};

export default ReCaptcha;
