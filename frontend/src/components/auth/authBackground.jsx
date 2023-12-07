import PropTypes from "prop-types"
import React from "react"
import AuthImage from "./authImage"
import bgFirst from "../../assets/imgs/bg-1.svg"
import bgSecond from "../../assets/imgs/bg-2.svg"

export default function AuthBackground({ children }) {
  const windowWidth = window.innerWidth
  return (
    <div className="container-fluid mx-auto flex h-full justify-center items-start max-w-[1536px] opacity-80">
      {windowWidth <= 767 ? (
        <AuthImage img={bgFirst} middle={true} />
      ) : (
        <>
          {" "}
          <AuthImage img={bgFirst} middle={true} />
          <AuthImage img={bgFirst} />
          <AuthImage img={bgSecond} middle={true} />
        </>
      )}
    </div>
  )
}

AuthBackground.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
