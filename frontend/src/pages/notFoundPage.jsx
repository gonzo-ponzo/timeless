import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import dictionary from "../utils/dictionary"

const NotFoundPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  let navigate = useNavigate()

  return (
    <div className="h-screen w-screen bg-cream flex justify-center items-center flex-col">
      <h2 className="text-darkBrown text-2xl font-bold">404</h2>
      <h3 className="text-darkBrown mb-[16px]">
        {dictionary[selectedLanguage].notFound}
      </h3>
      <button
        className="text-darkBrown hover:text-brown"
        onClick={() => navigate(-1)}
      >
        {dictionary[selectedLanguage].back}
      </button>{" "}
    </div>
  )
}

export default NotFoundPage
