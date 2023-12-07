import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import React from "react"
import PropTypes from "prop-types"
import UsersDropdown from "./usersDropdown"

const UserEditor = ({
  show,
  selectedUser,
  handleShow,
  users,
  handleSelectUser,
}) => {
  return (
    <>
      {selectedUser && (
        <div
          className="flex justify-between items-center w-full px-[16px] py-[12px] rounded-lg border border-gray max-md:text-sm max-md:mt-[10px]"
          onClick={handleShow}
        >
          <div className="flex cursor-pointer hover:opacity-80">
            {selectedUser?.image ? (
              <img
                className="w-[48px] h-[48px] mr-[6px] rounded-full"
                src={selectedUser?.image}
                alt=""
              />
            ) : null}
            <div>
              <p className="font-bold text-darkBrown">{selectedUser?.name}</p>
              <p className="font-thin">{selectedUser?.position}</p>
            </div>
          </div>
          <img
            className={
              !show ? "w-[16px] h-[16px]" : "w-[16px] h-[16px] rotate-180"
            }
            src={dropdownArrow}
            alt=""
          />
        </div>
      )}
      <UsersDropdown
        selectedUser={selectedUser}
        show={show}
        users={users}
        handleClick={handleSelectUser}
      ></UsersDropdown>
    </>
  )
}

UserEditor.propTypes = {
  show: PropTypes.bool,
  selectedUser: PropTypes.object,
  handleShow: PropTypes.func,
  users: PropTypes.array,
  handleSelectUser: PropTypes.func,
}

export default UserEditor
