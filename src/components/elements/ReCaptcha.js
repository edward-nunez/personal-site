import React from "react";

import ReCAPTCHA from "react-google-recaptcha";

/**
 * Simple ReCAPTCHA to prevent bots and spammers from abusing functionality.
 *
 * @param {Object} props.onChange Used to listen for changes of the reCAPTCHA validity.
 */
export default function ReCaptcha(props) {
  function handleValidness(valid) {
    if (valid !== null) {
      props.onChange(true); // True if value has valid captcha response stored
    } else {
      props.onChange(false); // False if value is null for no valid captcha response
    }
  }

  return (
    <>
      <ReCAPTCHA
        sitekey="6LeFmQkTAAAAAIwpph9vOJU7yCZQ2mAWb25B-VET"
        onChange={handleValidness}
      />
    </>
  );
}
