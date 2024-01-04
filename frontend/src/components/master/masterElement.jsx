import React from "react"
import PropTypes from "prop-types"
import star from "../../assets/imgs/Star 6.png"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setSelectedMaster } from "../../store/userSlice"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const MasterElement = ({ user, lastEl }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleClick = (user) => {
    dispatch(setSelectedMaster(user))
    navigate("/client/record")
  }
  return (
    <>
      <div
        className={
          lastEl
            ? "grid grid-cols-5 border border-gray rounded-b-lg"
            : "grid grid-cols-5 border border-gray"
        }
        key={user.id}
      >
        <Link to={`/client/master/${user.id}`}>
          <div className="py-[12px] px-[20px] flex max-md:py-[6px] max-md:px-[10px]">
            <img
              className="h-[26px] w-[26px] mr-[5px] rounded-full max-md:h-[15px] max-md:w-[15px] max-md:mr-[2px] max-md:hidden"
              src={user.image}
              alt=""
            />
            {user.name}
          </div>
        </Link>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {user.experience}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {user.position}
        </div>
        <div className="py-[12px] px-[20px] flex max-md:py-[6px] max-md:px-[10px] max-md:justify-center max-md:items:center">
          {user.image ? (
            <img
              className="w-[20px] h-[20px] mr-[5px] items-center max-md:w-[15px] max-md:h-[15px]"
              src={star}
              alt=""
            />
          ) : null}
          {user.rating}
        </div>
        <button
          className="py-[12px] px-[20px] text-start hover:opacity-80 max-md:py-[6px] max-md:px-[10px]"
          onClick={() => handleClick(user)}
        >
          {dictionary[selectedLanguage].record}
        </button>
      </div>
    </>
  )
}

MasterElement.propTypes = {
  user: PropTypes.object.isRequired,
  lastEl: PropTypes.bool,
}

export default MasterElement
