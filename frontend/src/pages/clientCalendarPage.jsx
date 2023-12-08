import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import { useDispatch, useSelector } from "react-redux"
import Calendar from "../components/ui/calendar"
import localStorageService from "../services/localStorage.service"
import RecordEditor from "../components/calendar/recordEditor"
import UserEditor from "../components/calendar/userEditor"
import CalendarBoard from "../components/calendar/calendarBoard"
import { setDate } from "../store/dateSlice"
import { useNavigate } from "react-router-dom"
import userService from "../services/user.service"
import recordService from "../services/record.service"
import serviceService from "../services/service.service"
import dictionary from "../utils/dictionary"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const ClientCalendarPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const clientId = localStorageService.getClientId()
  if (!clientId) {
    navigate("/login")
  }
  const dispatch = useDispatch()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)

  const handleSetDate = (date) => {
    setCalendarDate(date)
  }
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [records, setRecords] = useState([])

  const [selectedSlot, setSelectedSlot] = useState(null)
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)

  const [recordAdded, setRecordAdded] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  const handleShowUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
  }

  const handleAddRecord = () => {
    setRecordAdded(!recordAdded)
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setShowUserDropdown(!showUserDropdown)
    setSelectedSlot(null)
  }

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
  }

  const handleShowServiceDropdown = (e) => {
    setShowServiceDropdown(!showServiceDropdown)
  }

  const handleSelectService = (service) => {
    setSelectedService(service)
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot(null)
  }

  const loadData = async () => {
    const allUsers = await userService.getUsers()
    setUsers(allUsers.filter((user) => user.isStaff))
    setRecords(await recordService.getRecords())
    const filteredServices = await serviceService.getServices()
    setServices(
      filteredServices.filter(
        (service) =>
          !["Day off", "Odmar 1", "Odmar 2", "Odmar 4"].includes(service.name)
      )
    )
  }

  useEffect(() => {
    loadData()
  }, [recordAdded])
  useEffect(() => {
    if (users && !selectedMaster) {
      setSelectedUser(users[0])
    }
    if (services) {
      setSelectedService(services[0])
    }
  }, [users, services, selectedMaster])

  return (
    <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] text-lightBrown flex justify-center items-start bg-cream max-md:text-sm">
      <ContainerBox>
        <h2 className="text-xl max-md:text-lg">
          {dictionary[selectedLanguage].calendar}
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
        <div className="md:grid md:grid-cols-5 mt-[10px] max-md:flex max-md:flex-col">
          <div className="col-span-4 mr-[6px] flex border border-gray rounded-lg">
            <CalendarBoard
              firstDay={firstDay}
              records={records}
              services={services}
              selectedService={selectedService}
              selectedUser={selectedUser}
              selectedSlot={selectedSlot}
              handleSetDate={handleSetDate}
              handleSelectedSlot={handleSelectSlot}
              pageType={"client"}
            ></CalendarBoard>
          </div>
          <div className="flex flex-col w-full relative max-md:-order-1 max-md:mb-[10px]">
            <UserEditor
              show={showUserDropdown}
              selectedUser={selectedUser}
              handleShow={handleShowUserDropdown}
              handleSelectUser={handleSelectUser}
              users={users}
            ></UserEditor>
            <RecordEditor
              services={services}
              selectedService={selectedService}
              show={showServiceDropdown}
              handleClick={handleSelectService}
              handleShow={handleShowServiceDropdown}
              selectedUser={selectedUser}
              selectedSlot={selectedSlot}
              handleAddRecord={handleAddRecord}
              handleSelectedSlot={handleSelectSlot}
            ></RecordEditor>
          </div>
        </div>
      </ContainerBox>
    </div>
  )
}

export default ClientCalendarPage
