import React from "react"
import PropTypes from "prop-types"
import logo from "../../assets/imgs/logo.png"

export default function AuthCard({ children }) {
  return (
    <div className="mx-auto absolute max-w-[402px] max-md:max-w-[330px] z-10 py-[32px] px-[31px] rounded-lg border border-solid border-lightBrown bg-white self-start">
      <img className="w-100 mb-[24px]" src={logo} alt="" />
      {children}
    </div>
  )
}

AuthCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
