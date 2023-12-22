import PropTypes from "prop-types"
import transformDate from "../../utils/transformDate"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const CrmCalendarBoardDay = ({
  date,
  clients,
  selectedService,
  selectedUser,
  existingRecords,
  selectedSlot,
  handleSelectSlot,
  onSlotChange,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const boardDayDate = transformDate(date)
  const weekDays = dictionary[selectedLanguage].weekdays

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const recordsToShowElements = existingRecords?.map((record) => {
    if (record.type) {
      let content = null
      let styleName = `absolute flex justify-center left-[3px] w-[calc(100%-6px)] items-center rounded-lg p-[3px] border text-xs text-center hover:opacity-100 bg-${
        record.type
      } text-dark${capitalize(record.type)} border-dark${capitalize(
        record.type
      )} hover:bg-opacity-100 `
      let elementStyleName = `absolute left-0 top-[8px] ml-auto mr-auto rounded-r-lg w-[12px] bg-dark${capitalize(
        record.type
      )}`
      let clientName = clients
        ? clients.find((client) => client.id === record.clientId)?.name
        : null
      let recordTime = `${Math.floor(record.start / 60)}:${
        record.start - Math.floor(record.start / 60) * 60 > 9
          ? record.start - Math.floor(record.start / 60) * 60
          : `0${record.start - Math.floor(record.start / 60) * 60}`
      }`

      switch (record.type) {
        case "pink":
          content = dictionary[selectedLanguage].booked

          break
        case "green":
          styleName += " opacity-0 "
          content =
            record.duration <= 30 ? (
              recordTime
            ) : (
              <div>
                <p>
                  {selectedService ? selectedService.name : "Свободный слот"}
                </p>
                <p>{recordTime}</p>
                <p>{selectedUser?.name}</p>
              </div>
            )
          break
        case "blue":
          content =
            record.duration <= 30 ? (
              recordTime
            ) : (
              <div>
                <p>{record.name}</p>
                <p>{recordTime}</p>
                <p>{clientName}</p>
              </div>
            )
          break
        case "yellow":
          styleName += " bg-cream text-darkBrown border-darkBrown"
          elementStyleName += " bg-darkBrown"
          content =
            record.duration <= 30 ? (
              recordTime
            ) : (
              <div>
                <p>{record.name}</p>
                <p>{recordTime}</p>
                <p>{clientName}</p>
              </div>
            )
          break
        case "gray":
          styleName += "bg-white text-black border-gray"
          elementStyleName += "bg-gray"
          content = dictionary[selectedLanguage].dayOff

          break
        default:
          break
      }

      return (
        <div
          onClick={
            record.type === "green"
              ? () =>
                  handleSelectSlot({
                    slotId: date + record.start + selectedUser.name,
                    start: record.start,
                    end: record.end,
                    duration: record.duration,
                    type: record.type,
                    date: boardDayDate,
                    top: record.top,
                    recordId: record.recordId,
                    clientId: record.clientId,
                    userId: selectedUser.id,
                  })
              : record.type === "blue" || record.type === "yellow"
              ? () => onSlotChange(record.recordId)
              : null
          }
          className={
            selectedSlot !== null &&
            selectedSlot.slotId === date + record.start + selectedUser.name
              ? styleName + "opacity-100"
              : record?.type === "green"
              ? styleName
              : styleName + "opacity-100"
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
    }
  })
  let currentDate = new Date()
  let currentHour = currentDate.getHours()

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
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-t border-gray ${
            currentHour === 9 ? "border-b-red border-t-red" : null
          } ${currentHour === 10 ? "border-b-red" : null}`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 10 || currentHour === 11 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 11 || currentHour === 12 ? "border-b-red" : null
          }`}
        ></div>{" "}
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 12 || currentHour === 13 ? "border-b-red" : null
          }`}
        ></div>{" "}
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 13 || currentHour === 14 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 14 || currentHour === 15 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 15 || currentHour === 16 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 16 || currentHour === 17 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 17 || currentHour === 18 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 18 || currentHour === 19 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 19 || currentHour === 20 ? "border-b-red" : null
          }`}
        ></div>
        <div
          className={`flex h-[60px] w-full justify-center items-center border-b border-gray ${
            currentHour === 20 || currentHour === 21 ? "border-b-red" : null
          }`}
        ></div>{" "}
        <div className="flex h-[60px] w-full justify-center items-center"></div>
        {recordsToShowElements}
      </div>
    )
  }
}

CrmCalendarBoardDay.propTypes = {
  recordsToShowElements: PropTypes.array,
  userName: PropTypes.string,
  selectedService: PropTypes.object,
  existingRecords: PropTypes.array,
  boardDayDate: PropTypes.string,
  clients: PropTypes.array,
  handleSelectSlot: PropTypes.func,
  onSlotChange: PropTypes.func,
  selectedSlot: PropTypes.object,
  date: PropTypes.object,
}

export default CrmCalendarBoardDay
