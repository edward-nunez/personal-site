import React from "react";

export default function InputFeedback({ valid, touched, errorMessage }) {
  return (
    <>
      <div
        className="valid-feedback"
        style={{ display: valid && touched ? "block" : "none" }}
      >
        Looks good!
      </div>
      <div
        className="invalid-feedback"
        style={{
          display: !valid && touched ? "block" : "none",
        }}
      >
        {errorMessage}
      </div>
    </>
  );
}
