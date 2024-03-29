import PropTypes from "prop-types"
import _ from "lodash"
import { useEffect, useState } from "react"
import TimeGraph from "./timeGraph"
import CrmCalendarBoardDay from "./crmCalendarBoardDay"
import transformDate from "../../utils/transformDate"
import localStorageService from "../../services/localStorage.service"
import fillDayWithAvailableSlots from "../../utils/fillDayWithAvailableSlots"
import apiEnpoint from "../../services/config"

const CrmCalendarBoard = ({
  firstDay,
  selectedService,
  selectedUser,
  selectedSlot,
  selectedSlots,
  handleSelectedSlot,
  handleSelectSlots,
  complex,
  setSlotForChange,
}) => {
  const userId = localStorageService.getUserId()
  const daysCount = window.innerWidth <= 767 ? 1 : 4
  const [existingRecords, setExistingRecords] = useState({})

  useEffect(() => {
    for (const day of _.range(daysCount)) {
      const boardDayDate = transformDate(
        new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)
      )

      fetch(
        `${apiEnpoint}api/records/get-available-crm/${userId}/${
          selectedUser ? selectedUser.id : userId
        }/${boardDayDate}`
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
  }, [selectedService, daysCount, firstDay, selectedUser, userId])

  const onSlotChange = (recordId) => {
    setSlotForChange(recordId)
  }

  const calendarBoardDays = _.range(daysCount).map((day) => (
    <CrmCalendarBoardDay
      date={new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)}
      selectedService={selectedService ? selectedService : 1}
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
      onSlotChange={onSlotChange}
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

CrmCalendarBoard.propTypes = {
  date: PropTypes.instanceOf(Date),
  users: PropTypes.array,
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  selectedSlots: PropTypes.array,
  handleSelectedSlot: PropTypes.func,
  handleSelectSlots: PropTypes.func,
  handleSetDate: PropTypes.func,
  setSlotForChange: PropTypes.func,
  complex: PropTypes.bool,
}

export default CrmCalendarBoard
