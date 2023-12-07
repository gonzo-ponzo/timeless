import PropTypes from "prop-types"
import transformDate from "../../utils/transformDate"
import { useEffect, useState } from "react"
import recordService from "../../services/record.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientCalendarBoardDay = ({
  date,
  records,
  services,
  selectedService,
  selectedUser,
  selectedSlot,
  onSlotSelect,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [recordsToShow, setRecordsToShow] = useState(null)
  const boardDayDate = transformDate(date)
  const weekDays = dictionary[selectedLanguage].weekdays
  const loadData = async (selectedServiceId, selectedUserId, boardDayDate) => {
    setRecordsToShow(
      await recordService.getAvailableRecords(
        selectedServiceId,
        selectedUserId,
        boardDayDate
      )
    )
  }
  useEffect(() => {
    if (selectedUser && selectedService && boardDayDate) {
      loadData(selectedService.id, selectedUser.id, boardDayDate)
    }
  }, [selectedUser, selectedService, boardDayDate])

  const newRecords = []
  recordsToShow?.forEach((record) => {
    newRecords.push(record)
  })
  for (
    let start = 540;
    start + selectedService?.duration <= 1320;
    start += 10
  ) {
    let conflict = false
    newRecords?.forEach((record) => {
      if (record.start <= start && start < record.end) {
        conflict = true
      } else if (
        record.start < start + selectedService?.duration &&
        start + selectedService?.duration < record.end
      ) {
        conflict = true
      } else if (
        start < record.start &&
        record.start < start + selectedService?.duration
      ) {
        conflict = true
      }
    })
    if (!conflict) {
      newRecords.push({
        start: start,
        end: start + selectedService?.duration,
        duration: selectedService?.duration,
        type: "green",
        date: boardDayDate,
        top: start - 480,
      })
    }
  }

  const recordsToShowElements = newRecords?.map((record) => {
    let styleName =
      "absolute flex justify-center left-[3px] w-[calc(100%-6px)] items-center rounded-lg p-[3px] border text-xs text-center hover:opacity-70 "
    let elementStyleName =
      "absolute left-0 top-[8px] ml-auto mr-auto rounded-r-lg w-[12px] "
    switch (record.type) {
      case "pink":
        styleName += "bg-pink text-darkPink border-darkPink"
        elementStyleName += "bg-darkPink"
        break
      case "green":
        styleName += "bg-green text-darkGreen border-darkGreen"
        elementStyleName += "bg-darkGreen"
        break
      default:
        break
    }

    const content =
      record.type === "green" ? (
        record.duration <= 30 ? (
          `${Math.floor(record.start / 60)}:${
            record.start - Math.floor(record.start / 60) * 60 > 9
              ? record.start - Math.floor(record.start / 60) * 60
              : `0${record.start - Math.floor(record.start / 60) * 60}`
          }`
        ) : (
          <div>
            <p>{selectedService?.name}</p>
            <p>{`${Math.floor(record.start / 60)}:${
              record.start - Math.floor(record.start / 60) * 60 > 9
                ? record.start - Math.floor(record.start / 60) * 60
                : `0${record.start - Math.floor(record.start / 60) * 60}`
            }`}</p>
            <p>{selectedUser?.name}</p>
          </div>
        )
      ) : (
        dictionary[selectedLanguage].booked
      )

    return (
      <div
        onClick={
          record.type === "green"
            ? () =>
                onSlotSelect({
                  slotId: date + record.start,
                  start: record.start,
                  end: record.end,
                  duration: record.duration,
                  type: record.type,
                  date: boardDayDate,
                  top: record.top,
                })
            : null
        }
        className={
          selectedSlot !== null && selectedSlot.slotId !== date + record.start
            ? "absolute flex justify-center left-[3px] w-[calc(100%-6px)] items-center rounded-lg p-[3px] border text-xs text-center hover:opacity-70 text-gray border-gray"
            : styleName
        }
        style={{
          top: `${record.start + 2 - 480}px`,
          height: `${record.duration - 4}px`,
        }}
        key={date + record.start}
      >
        <span
          className={elementStyleName}
          style={{
            height: `${record.duration - 24}px`,
          }}
        ></span>
        {content}
      </div>
    )
  })

  if (recordsToShowElements) {
    return (
      <div className="flex flex-col relative">
        <div className="flex flex-col h-[60px] justify-center items-center text-sm ">
          <p>{date.getDate()}</p>
          <p
            className={
              date.getDay() === 0 || date.getDay() === 6 ? "text-red" : null
            }
          >
            {date.getDay() === 0 ? weekDays[6] : weekDays[date.getDay() - 1]}
          </p>
        </div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-t border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center border-b border-gray"></div>
        <div className="flex h-[60px] w-full justify-center items-center"></div>
        {recordsToShowElements}
      </div>
    )
  }
}

ClientCalendarBoardDay.propTypes = {
  date: PropTypes.object,
  records: PropTypes.array,
  services: PropTypes.array,
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  onSlotSelect: PropTypes.func,
  selectedSlot: PropTypes.object,
}

export default ClientCalendarBoardDay
