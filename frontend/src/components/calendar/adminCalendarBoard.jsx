import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import AdminCalendarBoardDay from "./adminCalendarBoardDay"
import brownTriangle from "../../assets/imgs/brownTriangle.png"
import transformDate from "../../utils/transformDate"
import fillDayWithAvailableSlots from "../../utils/fillDayWithAvailableSlots"

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
}) => {
  let calendarBoardDays
  let skippedDays = 0
  const [existingRecords, setExistingRecords] = useState({})
  const boardDayDate = transformDate(new Date(firstDay.getTime()))

  useEffect(() => {
    for (const user of users) {
      fetch(
        `http://localhost:8000/api/records/get-available-crm/1/${user.id}/${user.id}/${boardDayDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          const result = data
          setExistingRecords((prevState) => ({
            ...prevState,
            [user.id]: result,
          }))
        })
        .catch((error) => console.error(error))
    }
  }, [boardDayDate, selectedService, users])

  const onSlotChange = (recordId) => {
    setSlotForChange(recordId)
  }

  if (users?.lenght === existingRecords?.lenght) {
    calendarBoardDays = users.map((user) => {
      const userNameArray = user?.name.split(" ")
      const userName =
        userNameArray?.length > 1
          ? userNameArray[0] + " " + userNameArray[1][0] + "."
          : user?.name

      const userRecords = existingRecords[user.id]

      const date = new Date(firstDay.getTime())
      if (selectedService) {
        fillDayWithAvailableSlots(selectedService, userRecords, boardDayDate)
        const slotsForRecord = existingRecords[user.id].filter(
          (record) => record.type === "green"
        )

        if (slotsForRecord.length > 0) {
          return (
            <AdminCalendarBoardDay
              userName={userName}
              user={user}
              selectedService={selectedService}
              existingRecords={userRecords}
              boardDayDate={boardDayDate}
              clients={clients}
              handleSelectSlot={handleSelectedSlot}
              onSlotChange={onSlotChange}
              selectedSlot={selectedSlot}
              date={date}
            />
          )
        } else {
          skippedDays += 1
        }
      } else {
        return (
          <AdminCalendarBoardDay
            userName={userName}
            user={user}
            selectedService={null}
            existingRecords={userRecords}
            boardDayDate={boardDayDate}
            clients={clients}
            handleSelectSlot={handleSelectedSlot}
            onSlotChange={onSlotChange}
            selectedSlot={selectedSlot}
            date={date}
          />
        )
      }
    })
  }

  const windowWidth = window.innerWidth
  const [calendarStart, setCalendarStart] = useState(0)
  const [calendarEnd, setCalendarEnd] = useState(
    windowWidth <= 767
      ? 1
      : calendarBoardDays.length > 4
      ? 5
      : calendarBoardDays.length
  )

  const handleSetCalendars = (value) => {
    if (value > 0 && calendarEnd !== calendarBoardDays.length) {
      setCalendarEnd(calendarEnd + 1)
      setCalendarStart(calendarStart + 1)
    } else if (value < 0 && calendarStart !== 0) {
      setCalendarEnd(calendarEnd - 1)
      setCalendarStart(calendarStart - 1)
    }
  }

  const calendarRange = _.range(calendarStart, calendarEnd + skippedDays)
  const calendarBoardDaysToRender = calendarRange.map(
    (calendarIndex) => calendarBoardDays[calendarIndex]
  )
  const numberOfCols = calendarBoardDaysToRender.filter(
    (item) => item !== undefined
  ).length

  return (
    <>
      <TimeGraph></TimeGraph>
      <div className={`grid grid-cols-${numberOfCols} w-full relative`}>
        <img
          className={`absolute z-50 w-[15px] h-[20px] left-[5px] top-[18px] -rotate-90 ${
            calendarStart === 0 ? "hidden" : ""
          }`}
          src={brownTriangle}
          alt=""
          onClick={() => handleSetCalendars(-1)}
        />
        <img
          className={`absolute z-50 w-[15px] h-[20px] right-[5px] top-[18px] rotate-90 ${
            calendarBoardDays?.length ===
            numberOfCols + skippedDays + calendarStart
              ? "hidden"
              : ""
          }`}
          src={brownTriangle}
          alt=""
          onClick={() => handleSetCalendars(1)}
        />
        {calendarBoardDaysToRender}
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
