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
import { toast, ToastContainer } from "react-toastify"

const ClientCalendarPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const clientId = localStorageService.getClientId()
  if (!clientId) {
    navigate("/client/login")
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
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [records, setRecords] = useState([])
  const [complexes, setComplexes] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedSlots, setSelectedSlots] = useState([])
  const selectedMaster = useSelector((state) => state.user.selectedMaster)
  const [selectedUser, setSelectedUser] = useState(selectedMaster)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedComplex, setSelectedComplex] = useState(null)
  const [recordAdded, setRecordAdded] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const complex = selectedComplex ? true : false
  const [complexNumber, setComplexNumber] = useState(0)

  const loadData = async () => {
    const allUsers = await userService.getUsers()

    setRecords(await recordService.getRecords())
    const filteredServices = await serviceService.getServices()
    setServices(
      filteredServices.filter(
        (service) =>
          !["Day off", "Odmar 1", "Odmar 2", "Odmar 4", "Odmar 0.5"].includes(
            service.en
          )
      )
    )
    setComplexes(await serviceService.getComplexes())
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
    setSelectedUser(
      users.filter((user) => user.services.includes(selectedService?.id))[0]
    )
  }

  useEffect(() => {
    loadData()
  }, [recordAdded, selectedService, selectedComplex])

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
  }

  const handleSelectSlots = (slot) => {
    slot.serviceId = selectedService?.id
    if (selectedComplex && selectedSlots) {
      setSelectedSlots((prevState) => [...prevState, slot])
      setComplexNumber((prevState) => prevState + 1)
    }
  }
  useEffect(() => {
    if (selectedComplex) {
      setSelectedService(selectedComplex?.services[complexNumber])
    }
  }, [selectedSlots, selectedComplex, selectedService])

  const handleShowServiceDropdown = (e) => {
    setShowServiceDropdown(!showServiceDropdown)
  }

  const handleSelectService = (service) => {
    setSelectedComplex(null)
    setSelectedService(service)
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot(null)
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

  const handleSelectComplex = (complex) => {
    setComplexNumber(0)
    setSelectedComplex(complex)
    setSelectedService(complex?.services[complexNumber])
    setShowServiceDropdown(!showServiceDropdown)
    setSelectedSlot()
    setSelectedSlots([])
  }

  useEffect(() => {
    if (users && !selectedMaster) {
      setSelectedUser(users[0])
    }
  }, [users, selectedMaster])

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
              selectedSlots={selectedSlots}
              handleSelectedSlot={handleSelectSlot}
              handleSelectSlots={handleSelectSlots}
              complex={complex}
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
              services={services.filter((service) => service.active)}
              complexes={complexes}
              selectedService={selectedService}
              selectedComplex={selectedComplex}
              show={showServiceDropdown}
              handleSelectService={handleSelectService}
              handleSelectComplex={handleSelectComplex}
              handleMassAddRecord={handleMassAddRecord}
              handleShow={handleShowServiceDropdown}
              selectedUser={selectedUser}
              selectedSlot={selectedSlot}
              selectedSlots={selectedSlots}
              handleAddRecord={handleAddRecord}
              handleSelectedSlot={handleSelectSlot}
              successNotify={successNotify}
              errorNotify={errorNotify}
            ></RecordEditor>
          </div>
        </div>
      </ContainerBox>
    </div>
  )
}

export default ClientCalendarPage
