import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import ClientCalendarBoardDay from "./clientCalendarBoardDay"
import transformDate from "../../utils/transformDate"
import apiEnpoint from "../../services/config"
import fillDayWithAvailableSlots from "../../utils/fillDayWithAvailableSlots"

const CalendarBoard = ({
  firstDay,
  selectedService,
  selectedUser,
  selectedSlot,
  selectedSlots,
  handleSelectedSlot,
  handleSelectSlots,
  complex,
}) => {
  const daysCount = window.innerWidth <= 767 ? 1 : 4
  const [existingRecords, setExistingRecords] = useState({})

  useEffect(() => {
    for (const day of _.range(daysCount)) {
      const boardDayDate = transformDate(
        new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)
      )

      fetch(
        `${apiEnpoint}api/records/get-available/${selectedService?.id}/${selectedUser?.id}/${boardDayDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          const result = Object.keys(data).map((key) => data[key])
          setExistingRecords((prevState) => ({
            ...prevState,
            [boardDayDate]: selectedService
              ? fillDayWithAvailableSlots(
                  selectedService,
                  result,
                  boardDayDate,
                  selectedSlots,
                  selectedUser.id
                )
              : result,
          }))
        })
        .catch((error) => console.error(error))
    }
  }, [selectedService, daysCount, firstDay, selectedUser])

  const calendarBoardDays = _.range(daysCount).map((day) => (
    <ClientCalendarBoardDay
      date={new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)}
      selectedService={selectedService}
      selectedUser={selectedUser}
      existingRecords={
        existingRecords[
          transformDate(
            new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)
          )
        ]
      }
      handleSelectSlots={handleSelectSlots}
      selectedSlot={selectedSlot}
      handleSelectSlot={handleSelectedSlot}
      complex={complex}
      key={day}
    />
  ))

  return (
    <>
      <TimeGraph></TimeGraph>
      <div className="md:grid md:grid-cols-4 w-full relative">
        {calendarBoardDays}
      </div>
    </>
  )
}

CalendarBoard.propTypes = {
  firstDay: PropTypes.instanceOf(Date),
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  selectedSlots: PropTypes.array,
  handleSelectedSlot: PropTypes.func,
  handleSelectSlots: PropTypes.func,
  complex: PropTypes.bool,
}

export default CalendarBoard
