import React from "react";
import PropTypes from "prop-types";

export default function AuthImage({ img, middle }) {
  return (
    <img
      className={
        !middle
          ? "w-100 h-100 middle-auth-img rounded-full overflow-hidden opacity-50 mt-[500px]"
          : "w-100 h-100 middle-auth-img rounded-full overflow-hidden opacity-50"
      }
      src={img}
      alt=""
    />
  );
}

AuthImage.propTypes = {
  img: PropTypes.string.isRequired,
  position: PropTypes.number,
};
