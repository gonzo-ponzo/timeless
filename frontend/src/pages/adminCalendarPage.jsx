import { useNavigate } from "react-router-dom"
import localStorageService from "../services/localStorage.service"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ContainerBox from "../components/ui/containerBox"
import Calendar from "../components/ui/calendar"
import AdminCalendarBoard from "../components/calendar/adminCalendarBoard"
import AdminRecordEditor from "../components/calendar/adminRecordEditor"
import userService from "../services/user.service"
import serviceService from "../services/service.service"
import clientService from "../services/client.service"
import dictionary from "../utils/dictionary"
import { useDispatch } from "react-redux"
import { setDate } from "../store/dateSlice"
import brownTriangle from "../assets/imgs/brownTriangle.png"
import { toast, ToastContainer } from "react-toastify"

const AdminCalendarPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = localStorageService.getUserId()
  if (!userId) {
    navigate("/crm/login")
  }
  const [calendarDate, setCalendarDate] = useState(new Date())
  const firstDay = new Date(calendarDate)

  const successNotify = () =>
    toast.success(dictionary[selectedLanguage].success)
  const errorNotify = () => toast.error(dictionary[selectedLanguage].error)

  const handleSetDate = (date) => {
    setCalendarDate(date)
  }
  const [recordAdded, setRecordAdded] = useState(false)
  const [reset, setReset] = useState(1)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState()
  const [services, setServices] = useState([])
  const [clients, setClients] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)

  const [slotForChange, setSlotForChange] = useState(null)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setSlotForChange(null)
  }

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
  }

  const handleAddRecord = () => {
    setRecordAdded(!recordAdded)
  }

  const handleShowServiceDropdown = () => {
    setShowServiceDropdown(!showServiceDropdown)
  }
  const handleSelectService = (service) => {
    setSelectedService(service)
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot(null)
  }

  const loadData = async (userId) => {
    setClients(await clientService.getClients())
    setServices(await serviceService.getServices())
    const allUsers = await userService.getUsers()
    setUsers(
      selectedService
        ? allUsers.filter(
            (user) =>
              user.isStaff &&
              (user.services.includes(selectedService.id) ||
                ["Day off", "Odmar 1", "Odmar 2", "Odmar 4"].includes(
                  selectedService.en
                ))
          )
        : allUsers.filter((user) => user.isStaff)
    )
    setUser(await userService.getUserById(userId))
  }

  useEffect(() => {
    loadData(userId)
  }, [recordAdded, userId, selectedService])

  useEffect(() => {
    if (users && !selectedMaster) {
      setSelectedUser(users[0])
    }
  }, [users, selectedMaster])

  if (user) {
    if (user?.isStaff || user?.isAdmin) {
      return (
        <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] text-lightBrown flex justify-center items-start bg-cream max-md:text-sm">
          <ContainerBox>
            <h2 className="text-xl">{dictionary[selectedLanguage].calendar}</h2>
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
                <AdminCalendarBoard
                  key={reset}
                  firstDay={firstDay}
                  clients={clients}
                  users={users}
                  selectedService={selectedService}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  handleSelectedSlot={handleSelectSlot}
                  setSlotForChange={setSlotForChange}
                ></AdminCalendarBoard>
              </div>
              <div className="flex flex-col w-full relative max-md:-order-1 max-md:mb-[10px]">
                <AdminRecordEditor
                  services={services}
                  selectedService={selectedService}
                  currentUser={user}
                  show={showServiceDropdown}
                  handleClick={handleSelectService}
                  handleShow={handleShowServiceDropdown}
                  selectedSlot={selectedSlot}
                  handleSelectedSlot={handleSelectSlot}
                  handleAddRecord={handleAddRecord}
                  slotForChange={slotForChange}
                  successNotify={successNotify}
                  errorNotify={errorNotify}
                  reset={setReset}
                ></AdminRecordEditor>
              </div>
            </div>
          </ContainerBox>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      )
    } else {
      navigate("/crm/login")
    }
  }
}

export default AdminCalendarPage
