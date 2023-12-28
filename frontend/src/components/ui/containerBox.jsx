import PropTypes from "prop-types"
import React from "react"

export default function ContainerBox({ children }) {
  return (
    <div className="container p-[32px] max-md:p-[16px] max-w-[1496px] mb-[32px] mx-auto bg-white rounded-lg shadow-2xl">
      {children}
    </div>
  )
}

ContainerBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
