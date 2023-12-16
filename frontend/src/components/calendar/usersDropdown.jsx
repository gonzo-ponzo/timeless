import PropTypes from "prop-types"
import React from "react"

const UsersDropdown = ({ users, show, selectedUser, handleClick }) => {
  const dropdownUsers = users.filter((user) => user?.id !== selectedUser?.id)

  const userElements = dropdownUsers.map((user) => (
    <div
      className="flex  border-b border-gray px-[16px] py-[12px] cursor-pointer hover:opacity-80 last:border-none"
      key={user.id}
      onClick={() => {
        handleClick(user)
      }}
    >
      <img
        className="w-[48px] h-[48px] mr-[6px] rounded-full"
        src={user?.image}
        alt=""
      />
      <div>
        <p className="font-bold">{user?.name}</p>
        <p className="font-thin">{user?.position}</p>
      </div>
    </div>
  ))

  return show ? (
    <div className="rounded-lg border border-gray absolute z-[10000] top-[72px] left-0 w-full bg-white">
      {userElements}
    </div>
  ) : null
}

UsersDropdown.popTypes = {
  users: PropTypes.array,
  show: PropTypes.bool,
  selectedUser: PropTypes.object,
  handleClick: PropTypes.func,
}
export default UsersDropdown
