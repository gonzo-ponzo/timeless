import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import ContainerBox from "../components/ui/containerBox"
import Calendar from "../components/ui/calendar"
import UserPageHeader from "../components/master/masterPageHeader"
import UserPageRecords from "../components/master/masterPageRecords"
import UserPageComments from "../components/master/masterPageComments"
import userService from "../services/user.service"
import { useDispatch } from "react-redux"
import { setDate } from "../store/dateSlice"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const MasterPage = () => {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)
  const [user, setUser] = useState([])
  const loadData = async (userId) => {
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

  return (
    <div className="container-fluid relative mx-auto h-full text-lightBrown flex justify-center items-start bg-cream max-md:text-sm">
      <ContainerBox>
        <div className="my-[10px]">
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
        </div>
        <UserPageHeader user={user} />
        <UserPageRecords userId={user.id} date={date} />
        <UserPageComments userId={user.id} />
      </ContainerBox>
    </div>
  )
}

export default MasterPage
