import React from "react"
import PropTypes from "prop-types"
import MasterElement from "./masterElement"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const MastersList = ({ users }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const userElements = users
    ? users.map((user) => (
        <MasterElement
          user={user}
          lastEl={user === users[users.length - 1]}
        ></MasterElement>
      ))
    : null
  return (
    <div className="text-darkBrown pt-[32px]">
      <div className="grid grid-cols-5 bg-lightGray border border-gray rounded-t-lg  font-bold">
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {dictionary[selectedLanguage].userName}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {dictionary[selectedLanguage].expShort}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {dictionary[selectedLanguage].position}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {dictionary[selectedLanguage].rating}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {dictionary[selectedLanguage].record}
        </div>
      </div>
      {userElements}
    </div>
  )
}

MastersList.propTypes = {
  users: PropTypes.array,
}

export default MastersList
