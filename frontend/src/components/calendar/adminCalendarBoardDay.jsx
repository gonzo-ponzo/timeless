import PropTypes from "prop-types"
import transformDate from "../../utils/transformDate"
import { useEffect, useState } from "react"
import recordService from "../../services/record.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const AdminCalendarBoardDay = ({
  date,
  clients,
  user,
  selectedService,
  selectedSlot,
  onSlotSelect,
  setSlotForChange,
}) => {
  const userNameArray = user?.name.split(" ")
  const userName =
    userNameArray?.length > 1
      ? userNameArray[0] + " " + userNameArray[1][0] + "."
      : user?.name
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [recordsToShow, setRecordsToShow] = useState(null)
  const boardDayDate = transformDate(date)
  const loadData = async (
    selectedServiceId,
    userId,
    selectedUserId,
    boardDayDate
  ) => {
    if (selectedServiceId && userId && selectedUserId && boardDayDate) {
      setRecordsToShow(
        await recordService.getAvailableCrmRecords(
          selectedServiceId,
          userId,
          selectedUserId,
          boardDayDate
        )
      )
    }
  }
  useEffect(() => {
    if (user && selectedService && boardDayDate.length === 10) {
      loadData(selectedService.id, user.id, user.id, boardDayDate)
    }
  }, [user, selectedService, boardDayDate])
  const onSlotChange = (recordId) => {
    setSlotForChange(recordId)
  }

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
    let content = null
    let styleName =
      "absolute flex justify-center left-[3px] w-[calc(100%-6px)] items-center rounded-lg p-[3px] border text-xs text-center hover:opacity-100 "
    let elementStyleName =
      "absolute left-0 top-[8px] ml-auto mr-auto rounded-r-lg w-[12px] "
    switch (record.type) {
      case "pink":
        styleName += "bg-pink text-darkPink border-darkPink"
        elementStyleName += "bg-darkPink"
        content = dictionary[selectedLanguage].booked

        break
      case "green":
        styleName += "bg-green text-darkGreen border-darkGreen opacity-0 "
        elementStyleName += "bg-darkgreen"
        content =
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
              <p>{user?.name}</p>
            </div>
          )
        break
      case "blue":
        const clientBlue = clients
          ? clients.find((client) => client.id === record.clientId)
          : null
        styleName += "bg-blue text-darkBlue border-darkBlue"
        elementStyleName += "bg-darkBlue"
        content =
          record.duration <= 30 ? (
            `${Math.floor(record.start / 60)}:${
              record.start - Math.floor(record.start / 60) * 60 > 9
                ? record.start - Math.floor(record.start / 60) * 60
                : `0${record.start - Math.floor(record.start / 60) * 60}`
            }`
          ) : (
            <div>
              <p>{record.name}</p>
              <p>{`${Math.floor(record.start / 60)}:${
                record.start - Math.floor(record.start / 60) * 60 > 9
                  ? record.start - Math.floor(record.start / 60) * 60
                  : `0${record.start - Math.floor(record.start / 60) * 60}`
              }`}</p>
              <p>{clientBlue?.name}</p>
            </div>
          )
        break
      case "yellow":
        const clientYellow = clients
          ? clients.find((client) => client.id === record.clientId)
          : null
        styleName += "bg-cream text-darkBrown border-darkBrown"
        elementStyleName += "bg-darkBrown"
        content =
          record.duration <= 30 ? (
            `${Math.floor(record.start / 60)}:${
              record.start - Math.floor(record.start / 60) * 60 > 9
                ? record.start - Math.floor(record.start / 60) * 60
                : `0${record.start - Math.floor(record.start / 60) * 60}`
            }`
          ) : (
            <div>
              <p>{record.name}</p>
              <p>{`${Math.floor(record.start / 60)}:${
                record.start - Math.floor(record.start / 60) * 60 > 9
                  ? record.start - Math.floor(record.start / 60) * 60
                  : `0${record.start - Math.floor(record.start / 60) * 60}`
              }`}</p>
              <p>{clientYellow?.name}</p>
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
                onSlotSelect({
                  slotId: date + record.start + user.name,
                  start: record.start,
                  end: record.end,
                  duration: record.duration,
                  type: record.type,
                  date: boardDayDate,
                  top: record.top,
                  recordId: record.recordId,
                  clientId: record.clientId,
                  userId: user.id,
                })
            : record.type === "blue" || record.type === "yellow"
            ? () => onSlotChange(record.recordId)
            : null
        }
        className={
          selectedSlot !== null &&
          selectedSlot.slotId === date + record.start + user.name
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
  })

  if (recordsToShowElements) {
    return (
      <div className="flex flex-col relative">
        <div className="flex h-[60px] justify-center items-center text-sm ">
          {user?.image ? (
            <img
              className="rounded-full w-[38px] h-[38px] mr-[6px]"
              src={user.image}
              alt=""
            />
          ) : null}
          <p>{userName}</p>
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

AdminCalendarBoardDay.propTypes = {
  date: PropTypes.object,
  user: PropTypes.object,
  clients: PropTypes.array,
  selectedService: PropTypes.object,
  onSlotSelect: PropTypes.func,
  selectedSlot: PropTypes.object,
  slotForChange: PropTypes.object,
}

export default AdminCalendarBoardDay
