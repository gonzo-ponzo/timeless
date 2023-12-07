import React from "react"
import PropTypes from "prop-types"

const TextField = ({
  name,
  label,
  placeholder,
  onChange,
  type,
  area,
  value,
  error,
  disabled,
}) => {
  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value })
  }
  if (area) {
    return (
      <>
        {label ? (
          <label
            className="block text-brown text-lg mb-[8px] max-md:text-sm"
            htmlFor={name}
          >
            {label}
          </label>
        ) : null}
        <textarea
          className="border rounded-lg w-full border-lightBrown py-2 px-3 text-lightBrown placeholder-lightBrown focus:outline-brown"
          id={name}
          name={name}
          onChange={handleChange}
          disabled={disabled ? disabled : false}
          value={value ? value : null}
        ></textarea>
      </>
    )
  } else if (type === "file") {
    return (
      <>
        {label ? (
          <label
            className="block text-brown text-lg mb-[8px] max-md:text-sm"
            htmlFor={name}
          >
            {label}
          </label>
        ) : null}

        <input
          className="py-2 px-3 block w-full text-sm text-lightBrown placeholder-lightBrown border border-lightBrown rounded-lg cursor-pointer bg-white focus:outline-none file:text-lightBrown file:bg-white file:rounded-lg file:border-lightBrown file:outline-none file:border"
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ? value : null}
          disabled={disabled ? disabled : false}
          onChange={handleChange}
        />
      </>
    )
  }

  return (
    <>
      {label ? (
        <label
          className="block text-brown text-lg mb-[8px] max-md:text-sm"
          htmlFor={name}
        >
          {label}
        </label>
      ) : null}

      <input
        className={`border rounded-lg w-full border-lightBrown py-2 px-3 text-lightBrown placeholder-lightBrown focus:outline-brown ${
          error ? "focus:outline-red border-red" : ""
        }`}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value ? value : null}
        disabled={disabled ? disabled : false}
        onChange={handleChange}
      />
      {error ? <p className="text-red text-sm">{error}</p> : null}
    </>
  )
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  area: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
}

export default TextField
