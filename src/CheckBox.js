import React from "react";

function Checkbox({ value, checked, onChange, iconUrl }) {
  return (
    <label>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <img src={iconUrl} alt={value} width="20" height="20" style={{ border: "1px solid black" }} />    {value}
    </label>
  );
}

export default Checkbox;