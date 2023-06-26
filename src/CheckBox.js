import React from "react";

function Checkbox({ value, checked, onChange }) {
  return (
    <label>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {value}
    </label>
  );
}

export default Checkbox;
