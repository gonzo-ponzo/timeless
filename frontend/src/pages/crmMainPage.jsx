import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import Calendar from "../components/ui/calendar"
import RecordsList from "../components/home/recordsList"
import "../index.css"
import { useSelector, useDispatch } from "react-redux"
import localStorageService from "../services/localStorage.service"
import { useNavigate } from "react-router-dom"
import recordService from "../services/record.service"
import dictionary from "../utils/dictionary"
import userService from "../services/user.service"
import { setDate } from "../store/dateSlice"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const CrmMainPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = localStorageService.getUserId()
  if (!userId) {
    navigate("/crm/login")
  }
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)
  const [records, setRecords] = useState([])
  const [user, setUser] = useState(null)
  const loadData = async (userId) => {
    setRecords(await recordService.getRecords())
    setUser(await userService.getUserById(userId))
  }
  useEffect(() => {
    loadData(userId)
  }, [userId])

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
  }

  const handleSetDate = async (date) => {
    setCalendarDate(date)
    const dateStore = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`
    await dispatch(setDate(dateStore))
  }

  let date = useSelector((state) => state.date.date).split(".")
  date = `${date[2]}-${Number(date[1]) > 9 ? date[1] : "0" + Number(date[1])}-${
    Number(date[0]) > 9 ? date[0] : "0" + Number(date[0])
  }`

  const userRecords = records
    ? user?.isAdmin && !user?.isStaff
      ? records.filter((record) => record.date === date)
      : records
          .filter((record) => record.users.includes(Number(userId)))
          .filter((record) => record.date === date)
    : null

  if (user) {
    if (user.isStaff || user.isAdmin) {
      return (
        <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream ">
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
                  handleSetDate(
                    new Date(firstDay.getTime() - 1000 * 60 * 60 * 24)
                  )
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
                  handleSetDate(
                    new Date(firstDay.getTime() + 1000 * 60 * 60 * 24)
                  )
                }
              />
            </div>
            <RecordsList
              filteredRecords={userRecords}
              pageType={"user"}
            ></RecordsList>
          </ContainerBox>
        </div>
      )
    } else {
      navigate("/crm/login")
    }
  }
}

export default CrmMainPage
