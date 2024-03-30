import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import AdminCalendarBoardDay from "./adminCalendarBoardDay"
import brownTriangle from "../../assets/imgs/brownTriangle.png"
import transformDate from "../../utils/transformDate"
import fillDayWithAvailableSlots from "../../utils/fillDayWithAvailableSlots"
import apiEnpoint from "../../services/config"

const AdminCalendarBoard = ({
  firstDay,
  users,
  selectedService,
  selectedSlot,
  selectedSlots,
  handleSelectedSlot,
  handleSelectSlots,
  complex,
  setSlotForChange,
  setReset,
}) => {
  let calendarBoardDays
  const [existingRecords, setExistingRecords] = useState({})
  const boardDayDate = transformDate(new Date(firstDay.getTime()))

  useEffect(() => {
    setCalendarStart(0)
    setCalendarEnd(
      windowWidth <= 767
        ? 1
        : filteredCalendarBoardDays?.length > 4
        ? 5
        : filteredCalendarBoardDays?.length
    )
    for (const user of users) {
      fetch(
        `${apiEnpoint}api/records/get-available-crm/${user.id}/${user.id}/${boardDayDate}`
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
        const existingRecordsWithSlots = fillDayWithAvailableSlots(
          selectedService,
          userRecords,
          boardDayDate,
          selectedSlots,
          user.id
        )
        const slotsForRecord = existingRecordsWithSlots.filter(
          (record) => record.type === "green"
        )
        if (slotsForRecord.length > 0) {
          return (
            <AdminCalendarBoardDay
              userName={userName}
              user={user}
              selectedService={selectedService}
              existingRecords={existingRecordsWithSlots}
              boardDayDate={boardDayDate}
              handleSelectSlot={handleSelectedSlot}
              handleSelectSlots={handleSelectSlots}
              selectedSlots={selectedSlots}
              onSlotChange={onSlotChange}
              selectedSlot={selectedSlot}
              date={date}
              setReset={setReset}
              complex={complex}
            />
          )
        }
      } else {
        return (
          <AdminCalendarBoardDay
            userName={userName}
            user={user}
            selectedService={null}
            existingRecords={userRecords}
            boardDayDate={boardDayDate}
            selectedSlots={selectedSlots}
            handleSelectSlot={handleSelectedSlot}
            handleSelectSlots={handleSelectSlots}
            onSlotChange={onSlotChange}
            selectedSlot={selectedSlot}
            date={date}
            complex={complex}
            setReset={setReset}
          />
        )
      }
    })
  }

  const handleSetCalendars = (value) => {
    if (value > 0 && calendarEnd !== filteredCalendarBoardDays.length) {
      setCalendarEnd(calendarEnd + 1)
      setCalendarStart(calendarStart + 1)
    } else if (value < 0 && calendarStart !== 0) {
      setCalendarEnd(calendarEnd - 1)
      setCalendarStart(calendarStart - 1)
    }
  }

  const filteredCalendarBoardDays = Object.values(calendarBoardDays).filter(
    (value) => value !== undefined
  )
  const windowWidth = window.innerWidth
  const [calendarStart, setCalendarStart] = useState(0)
  const [calendarEnd, setCalendarEnd] = useState(
    windowWidth <= 767
      ? 1
      : filteredCalendarBoardDays.length > 4
      ? 5
      : filteredCalendarBoardDays.length
  )
  const calendarRange = _.range(calendarStart, calendarEnd)

  const calendarBoardDaysToRender = calendarRange.map(
    (calendarIndex) => filteredCalendarBoardDays[calendarIndex]
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
            filteredCalendarBoardDays?.length === numberOfCols + calendarStart
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
  clients: PropTypes.array,
  users: PropTypes.array,
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  selectedSlots: PropTypes.array,
  handleSelectedSlot: PropTypes.func,
  handleSelectSlots: PropTypes.func,
  handleSetDate: PropTypes.func,
  setSlotForChange: PropTypes.func,
  pageType: PropTypes.string,
  complex: PropTypes.bool,
}

export default AdminCalendarBoard
