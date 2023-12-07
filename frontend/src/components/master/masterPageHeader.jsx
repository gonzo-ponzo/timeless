import { Link } from "react-router-dom"
import phoneLogo from "../../assets/imgs/Vector.png"
import React from "react"
import PropTypes from "prop-types"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const MasterPageHeader = ({ user }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <>
      <Link to="/masters" className="hover:opacity-80">
        {dictionary[selectedLanguage].toUsersList}
      </Link>
      <div className="flex justify-between items-center py-[20px]">
        <div className="flex flex-col items-start">
          <div className="flex">
            <img
              className="h-[200px] w-[200px] mr-[10px] rounded-full max-md:h-[100px] max-md:w-[100px]"
              src={user.image}
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-3xl">{user.name}</p>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <img
                    className="h-[16px] w-[16px] mr-[6px]"
                    src={phoneLogo}
                    alt=""
                  />
                  <p>
                    <a href={`tel:${user.phone}`}>{user.phone}</a>
                  </p>
                </div>
                <p>
                  {dictionary[selectedLanguage].position}: {user.position}
                </p>
                <p>
                  {dictionary[selectedLanguage].experience}: {user.experience}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

MasterPageHeader.propTypes = {
  user: PropTypes.object.isRequired,
}

export default MasterPageHeader
