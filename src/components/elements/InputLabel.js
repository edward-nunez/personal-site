import React from "react";

export default function InputLabel({ id, children }) {
  return (
    <label htmlFor={id} className="form-label">
      {children}
    </label>
  );
}
