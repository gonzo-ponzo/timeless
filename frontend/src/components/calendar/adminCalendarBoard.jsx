import PropTypes from "prop-types"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import AdminCalendarBoardDay from "./adminCalendarBoardDay"
import brownTriangle from "../../assets/imgs/brownTriangle.png"
import { useState } from "react"

const AdminCalendarBoard = ({
  firstDay,
  records,
  services,
  clients,
  users,
  selectedService,
  selectedSlot,
  handleSelectedSlot,
  setSlotForChange,
  handleSetDate,
}) => {
  const windowWidth = window.innerWidth
  const [userStart, setUserStart] = useState(0)
  const [userEnd, setUserEnd] = useState(
    windowWidth <= 767 ? 1 : users.length > 4 ? 5 : users.length
  )

  const handleSetUsers = (value) => {
    if (value > 0 && userEnd !== users.length) {
      setUserEnd(userEnd + 1)
      setUserStart(userStart + 1)
    } else if (value < 0 && userStart !== 0) {
      setUserEnd(userEnd - 1)
      setUserStart(userStart - 1)
    }
  }

  const calendarBoardDays = _.range(userStart, userEnd).map((userIndex) => (
    <AdminCalendarBoardDay
      date={new Date(firstDay.getTime())}
      records={records}
      services={services}
      clients={clients}
      user={users[userIndex]}
      selectedService={selectedService ? selectedService : { id: 1 }}
      key={this?.length}
      selectedSlot={selectedSlot}
      onSlotSelect={handleSelectedSlot}
      setSlotForChange={setSlotForChange}
    />
  ))

  return (
    <>
      <TimeGraph></TimeGraph>
      <div className={`grid grid-cols-${userEnd - userStart} w-full relative`}>
        <img
          className={`absolute z-50 w-[15px] h-[20px] left-[5px] top-[18px] -rotate-90 ${
            userStart === 0 ? "hidden" : ""
          }`}
          src={brownTriangle}
          alt=""
          onClick={() => handleSetUsers(-1)}
        />
        <img
          className={`absolute z-50 w-[15px] h-[20px] right-[5px] top-[18px] rotate-90 ${
            users?.length === userEnd ? "hidden" : ""
          }`}
          src={brownTriangle}
          alt=""
          onClick={() => handleSetUsers(1)}
        />
        {calendarBoardDays}
      </div>
    </>
  )
}

AdminCalendarBoard.propTypes = {
  date: PropTypes.instanceOf(Date),
  records: PropTypes.array,
  services: PropTypes.array,
  clients: PropTypes.array,
  users: PropTypes.array,
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  handleSelectedSlot: PropTypes.func,
  handleSetDate: PropTypes.func,
  setSlotForChange: PropTypes.func,
  pageType: PropTypes.string,
}

export default AdminCalendarBoard
