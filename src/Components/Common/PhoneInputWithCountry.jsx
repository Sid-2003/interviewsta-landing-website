import React from "react";
import PhoneInput from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

/**
 * Phone number input with country selector.
 * Value is E.164 (e.g. +12125551234). Use onCountryChange to get selected country code (e.g. "US").
 * Styled to match form fields: border border-gray-300 rounded-lg py-3.
 */
const PhoneInputWithCountry = ({
  value,
  onChange,
  onCountryChange,
  defaultCountry = "US",
  disabled,
  placeholder = "Enter phone number",
  className = "",
  id,
}) => (
  <div className={`phone-input-form-style ${disabled ? "disabled" : ""} ${className}`.trim()}>
    <PhoneInput
      id={id}
      international
      defaultCountry={defaultCountry}
      countryCallingCodeEditable={false}
      value={value || undefined}
      onChange={onChange}
      onCountryChange={onCountryChange}
      labels={en}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

export default PhoneInputWithCountry;
