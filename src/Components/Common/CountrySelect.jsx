import React from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

/**
 * Country / Region dropdown. Value is ISO 3166-1 alpha-2 (e.g. "US", "IN").
 */
const CountrySelect = ({
  value,
  onChange,
  disabled,
  placeholder = "Select country or region",
  className = "",
  id,
  showCallingCode = false,
}) => (
  <select
    id={id}
    value={value || ""}
    onChange={(e) => onChange(e.target.value || undefined)}
    disabled={disabled}
    className={
      className || "country-select-form-style block w-full"
    }
  >
    <option value="">{placeholder}</option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {en[country] || country}
        {showCallingCode ? ` +${getCountryCallingCode(country)}` : ""}
      </option>
    ))}
  </select>
);

export default CountrySelect;
