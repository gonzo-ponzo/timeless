import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import { useDispatch, useSelector } from "react-redux"
import Calendar from "../components/ui/calendar"
import CrmRecordEditor from "../components/calendar/crmRecordEditor"
import UserEditor from "../components/calendar/userEditor"
import CrmCalendarBoard from "../components/calendar/crmCalendarBoard"
import { setDate } from "../store/dateSlice"
import { useNavigate } from "react-router-dom"
import localStorageService from "../services/localStorage.service"
import AdminCalendarPage from "./adminCalendarPage"
import userService from "../services/user.service"
import clientService from "../services/client.service"
import serviceService from "../services/service.service"
import dictionary from "../utils/dictionary"
import brownTriangle from "../assets/imgs/brownTriangle.png"
import { toast, ToastContainer } from "react-toastify"

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
  const successNotify = () =>
    toast.success(dictionary[selectedLanguage].success)
  const errorNotify = () => toast.error(dictionary[selectedLanguage].error)

  const handleSetDate = (date) => {
    setCalendarDate(date)
  }
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [reset, setReset] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedComplex, setSelectedComplex] = useState(null)
  const [slotForChange, setSlotForChange] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState(null)
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [complexes, setComplexes] = useState([])
  const [recordAdded, setRecordAdded] = useState(false)
  const complex = selectedComplex ? true : false
  const [complexNumber, setComplexNumber] = useState(0)

  const loadData = async (userId) => {
    setUser(await userService.getUserById(userId))
    setClients(await clientService.getClients())
    const allUsers = await userService.getUsers()
    setUsers(
      selectedService
        ? allUsers.filter(
            (user) =>
              user.isStaff &&
              (user.services.includes(selectedService.id) ||
                [
                  "Day off",
                  "Odmar 1",
                  "Odmar 2",
                  "Odmar 4",
                  "Odmar 0.5",
                ].includes(selectedService.en))
          )
        : allUsers.filter((user) => user.isStaff)
    )
    setServices(await serviceService.getServices())
    setComplexes(await serviceService.getComplexes())
  }
  useEffect(() => {
    loadData(userId)
  }, [userId, recordAdded, selectedService, selectedComplex])

  const handleShowUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
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

  const handleSelectSlots = (slot) => {
    slot.serviceId = selectedService?.id
    if (selectedComplex && selectedSlots) {
      setSelectedSlots((prevState) => [...prevState, slot])
      setComplexNumber((prevState) => prevState + 1)
    }
    setSlotForChange(null)
  }
  useEffect(() => {
    if (selectedComplex) {
      setSelectedService(selectedComplex?.services[complexNumber])
    }
  }, [selectedSlots, selectedComplex, selectedService])

  const handleShowServiceDropdown = () => {
    setShowServiceDropdown(!showServiceDropdown)
  }
  const handleSelectService = (service) => {
    setSelectedComplex(null)
    setSelectedService(service)
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot()
    setSelectedSlots([])
  }

  const handleSelectComplex = (complex) => {
    setComplexNumber(0)
    setSelectedComplex(complex)
    setSelectedService(complex?.services[complexNumber])
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot()
    setSelectedSlots([])
  }

  const handleAddRecord = () => {
    setRecordAdded(!recordAdded)
  }

  const handleMassAddRecord = () => {
    handleAddRecord()
    setSelectedComplex(null)
    setSelectedService(null)
    setSelectedSlots([])
    setSelectedSlot(null)
    setComplexNumber(0)
  }

  useEffect(() => {
    if (users && !selectedMaster) {
      const currentUserInUsers = users.find(
        (user) => user.id === Number(userId)
      )
      if (currentUserInUsers) {
        setSelectedUser(currentUserInUsers)
      } else {
        setSelectedUser(users[0])
      }
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
                <CrmCalendarBoard
                  key={reset}
                  firstDay={firstDay}
                  selectedService={selectedService}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  selectedSlots={selectedSlots}
                  clients={clients}
                  handleSelectedSlot={handleSelectSlot}
                  handleSelectSlots={handleSelectSlots}
                  complex={complex}
                  setSlotForChange={setSlotForChange}
                ></CrmCalendarBoard>
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
                  complexes={complexes}
                  selectedService={selectedService}
                  selectedComplex={selectedComplex}
                  show={showServiceDropdown}
                  handleSelectService={handleSelectService}
                  handleSelectComplex={handleSelectComplex}
                  handleMassAddRecord={handleMassAddRecord}
                  handleShow={handleShowServiceDropdown}
                  handleAddRecord={handleAddRecord}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  selectedSlots={selectedSlots}
                  handleSelectedSlot={handleSelectSlot}
                  slotForChange={slotForChange}
                  successNotify={successNotify}
                  errorNotify={errorNotify}
                  reset={setReset}
                ></CrmRecordEditor>
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

export default CrmCalendarPage
