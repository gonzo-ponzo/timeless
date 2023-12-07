import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import Calendar from "../components/ui/calendar"
import "../index.css"
import { useSelector } from "react-redux"
import localStorageService from "../services/localStorage.service"
import RecordsList from "../components/home/recordsList"
import { useNavigate } from "react-router-dom"
import recordService from "../services/record.service"
import dictionary from "../utils/dictionary"
import { useDispatch } from "react-redux"
import { setDate } from "../store/dateSlice"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const ClientMainPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)
  const clientId = localStorageService.getClientId()
  if (!clientId) {
    navigate("/login")
  }
  const [records, setRecords] = useState(null)
  const loadData = async () => {
    setRecords(await recordService.getRecords())
  }
  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
  }
  let date = useSelector((state) => state.date.date).split(".")
  date = `${date[2]}-${Number(date[1]) > 9 ? date[1] : "0" + Number(date[1])}-${
    Number(date[0]) > 9 ? date[0] : "0" + Number(date[0])
  }`

  const handleSetDate = async (date) => {
    setCalendarDate(date)
    const dateStore = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`
    await dispatch(setDate(dateStore))
  }

  useEffect(() => {
    loadData()
  }, [])
  const clientRecords = records
    ? records
        .filter(
          (record) =>
            record.clientId === Number(localStorageService.getClientId())
        )
        .filter((r) => r.date === date)
    : null

  return (
    <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream">
      <ContainerBox>
        <h2 className="text-brown text-2xl max-md:text-lg">
          {dictionary[selectedLanguage].serviceList}
        </h2>
        <div className="flex items-center">
          <img
            className="-rotate-90 w-[12px] h-[15px]"
            src={brownTriangle}
            alt=""
            onClick={() =>
              handleSetDate(new Date(firstDay.getTime() - 1000 * 60 * 60 * 24))
            }
          />
          <Calendar
            date={new Date(firstDay.getTime())}
            handleSelectDate={handleDateSelect}
          ></Calendar>
          <img
            className="rotate-90 w-[12px] h-[15px]"
            src={brownTriangle}
            alt=""
            onClick={() =>
              handleSetDate(new Date(firstDay.getTime() + 1000 * 60 * 60 * 24))
            }
          />
        </div>

        <RecordsList
          filteredRecords={clientRecords}
          pageType={"client"}
        ></RecordsList>
      </ContainerBox>
    </div>
  )
}

export default ClientMainPage
