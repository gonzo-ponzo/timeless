import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import { useParams } from "react-router-dom"
import ClientPageHeader from "../components/clients/clientPageHeader"
import ClientPageRecords from "../components/clients/ClientPageRecords"
import ClientPageComments from "../components/clients/clientPageComments"
import Calendar from "../components/ui/calendar"
import { useSelector } from "react-redux"
import clientService from "../services/client.service"
import { useDispatch } from "react-redux"
import { setDate } from "../store/dateSlice"
import localStorageService from "../services/localStorage.service"
import userService from "../services/user.service"
import { useNavigate } from "react-router-dom"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const ClientPage = () => {
  const { clientId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)
  const [client, setClient] = useState([])
  const [clientsHistory, setClientsHistory] = useState([])
  const userId = localStorageService.getUserId()
  const [user, setUser] = useState(null)
  const [showFullHistory, setShowFullHistory] = useState(false)
  const loadData = async (clientId, userId, showFullHistory) => {
    setClient(await clientService.getClientById(clientId))
    setUser(await userService.getUserById(userId))
    if (showFullHistory) {
      setClientsHistory(await clientService.getClientsHistoryById(clientId))
    }
  }
  useEffect(() => {
    loadData(clientId, userId, showFullHistory)
  }, [clientId, userId, showFullHistory])

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

  if (user) {
    if (user.isStaff || user.isAdmin) {
      return (
        <div className="container-fluid relative mx-auto min-h-screen pb-[32px] text-lightBrown flex justify-center items-start bg-cream max-md:text-sm">
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
            <ClientPageHeader
              client={client}
              showFullHistory={showFullHistory}
              setShowFullHistory={setShowFullHistory}
              clientsHistory={clientsHistory}
              user={user}
            />
            <ClientPageRecords clientId={client.id} date={date} />
            <ClientPageComments clientId={client.id} />
          </ContainerBox>
        </div>
      )
    } else {
      navigate("/")
    }
  }
}

export default ClientPage
