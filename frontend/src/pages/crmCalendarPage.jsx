import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import { useDispatch, useSelector } from "react-redux"
import Calendar from "../components/ui/calendar"
import CrmRecordEditor from "../components/calendar/crmRecordEditor"
import UserEditor from "../components/calendar/userEditor"
import CalendarBoard from "../components/calendar/calendarBoard"
import { setDate } from "../store/dateSlice"
import { useNavigate } from "react-router-dom"
import localStorageService from "../services/localStorage.service"
import AdminCalendarPage from "./adminCalendarPage"
import recordService from "../services/record.service"
import userService from "../services/user.service"
import clientService from "../services/client.service"
import serviceService from "../services/service.service"
import dictionary from "../utils/dictionary"
import brownTriangle from "../assets/imgs/brownTriangle.png"

const CrmCalendarPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const userId = localStorageService.getUserId()
  if (!userId) {
    navigate("/crm/login")
  }
  const dispatch = useDispatch()
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)

  const handleSetDate = (date) => {
    setCalendarDate(date)
  }
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [reset, setReset] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)
  const [slotForChange, setSlotForChange] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState(null)
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [records, setRecords] = useState([])
  const [recordAdded, setRecordAdded] = useState(false)

  const loadData = async (userId) => {
    setUser(await userService.getUserById(userId))
    setClients(await clientService.getClients())
    setRecords(await recordService.getRecords())
    const allUsers = await userService.getUsers()
    setUsers(allUsers.filter((user) => user.isStaff))
    setServices(await serviceService.getServices())
  }
  useEffect(() => {
    loadData(userId)
  }, [userId, recordAdded])

  const handleShowUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    console.log(date)
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setShowUserDropdown(!showUserDropdown)
    setSelectedSlot(null)
  }
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setSlotForChange(null)
  }

  const handleShowServiceDropdown = () => {
    setShowServiceDropdown(!showServiceDropdown)
  }
  const handleSelectService = (service) => {
    setSelectedService(service)
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot(null)
  }

  const handleAddRecord = () => {
    setRecordAdded(!recordAdded)
  }

  const handleCancel = async (recordId, notify) => {
    await recordService.CancelRecord({ recordId })
    setServices(records.filter((record) => record.id !== recordId))
    notify()
  }

  useEffect(() => {
    if (users && !selectedMaster) {
      setSelectedUser(
        users[users.indexOf(users.find((user) => user.id === Number(userId)))]
      )
    }
  }, [users, selectedMaster, userId])

  if (user?.isAdmin) {
    return <AdminCalendarPage></AdminCalendarPage>
  }
  if (user) {
    if (user.isStaff || user.isAdmin) {
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
            <div className="md:grid md:grid-cols-5  mt-[10px] max-md:flex max-md:flex-col">
              <div className="col-span-4 mr-[6px] flex border border-gray rounded-lg">
                <CalendarBoard
                  key={reset}
                  firstDay={firstDay}
                  records={records}
                  services={services}
                  selectedService={selectedService}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  clients={clients}
                  handleSelectedSlot={handleSelectSlot}
                  pageType={"crm"}
                  setSlotForChange={setSlotForChange}
                  handleSetDate={handleSetDate}
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
                <CrmRecordEditor
                  services={services}
                  selectedService={selectedService}
                  show={showServiceDropdown}
                  handleClick={handleSelectService}
                  handleShow={handleShowServiceDropdown}
                  handleAddRecord={handleAddRecord}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  handleSelectedSlot={handleSelectSlot}
                  handleCancel={handleCancel}
                  slotForChange={slotForChange}
                  reset={setReset}
                ></CrmRecordEditor>
              </div>
            </div>
          </ContainerBox>
        </div>
      )
    } else {
      navigate("/crm/login")
    }
  }
}

export default CrmCalendarPage
