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
  const [complexes, setComplexes] = useState([])
  const [selectedSlot, setSelectedSlot] = useState()
  const [selectedSlots, setSelectedSlots] = useState([])
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedComplex, setSelectedComplex] = useState(null)
  const [slotForChange, setSlotForChange] = useState(null)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const complex = selectedComplex ? true : false
  const [complexNumber, setComplexNumber] = useState(0)

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

  const handleDateSelect = async (date) => {
    setCalendarDate(new Date(date.year, date.month - 1, date.day))
    const dateStore = `${date.day}.${date.month}.${date.year}`
    await dispatch(setDate(dateStore))
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

  const loadData = async (userId) => {
    setServices(await serviceService.getServices())
    setComplexes(await serviceService.getComplexes())
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
    setUser(await userService.getUserById(userId))
  }

  useEffect(() => {
    loadData(userId)
  }, [recordAdded, userId, selectedService, selectedComplex])

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
                  users={users}
                  selectedService={selectedService}
                  selectedUser={selectedUser}
                  selectedSlot={selectedSlot}
                  selectedSlots={selectedSlots}
                  handleSelectedSlot={handleSelectSlot}
                  handleSelectSlots={handleSelectSlots}
                  complex={complex}
                  setSlotForChange={setSlotForChange}
                ></AdminCalendarBoard>
              </div>
              <div className="flex flex-col w-full relative max-md:-order-1 max-md:mb-[10px]">
                <AdminRecordEditor
                  currentUser={user}
                  show={showServiceDropdown}
                  services={services.filter((service) => service.active)}
                  complexes={complexes}
                  selectedService={selectedService}
                  selectedComplex={selectedComplex}
                  handleSelectService={handleSelectService}
                  handleSelectComplex={handleSelectComplex}
                  handleMassAddRecord={handleMassAddRecord}
                  handleShow={handleShowServiceDropdown}
                  selectedSlot={selectedSlot}
                  selectedSlots={selectedSlots}
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
