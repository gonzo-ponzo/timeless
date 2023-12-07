import PropTypes from "prop-types"
import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import recordService from "../../services/record.service"
import localStorageService from "../../services/localStorage.service"
import TextField from "../textField"
import userService from "../../services/user.service"
import clientService from "../../services/client.service"
import DetailedRecordInfo from "./detailedRecordInfo"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const CrmRecordEditor = ({
  selectedService,
  services,
  records,
  clients,
  show,
  handleClick,
  handleShow,
  selectedSlot,
  selectedUser,
  handleSelectedSlot,
  handleCancel,
  handleAddRecord,
  slotForChange,
  reset,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const [client, setClient] = useState(null)
  const [search, setSearch] = useState("")
  const [dropdownServices, setDropdownServices] = useState()
  const [data, setData] = useState({
    phone: "+",
    instagram: "",
    telegram: "",
    name: "",
  })

  let phoneError
  if (data.phone.startsWith("+3") && data.phone.length !== 13) {
    phoneError = "phone must contain 12 digits"
  }
  if (data.phone.startsWith("+7") && data.phone.length !== 12) {
    phoneError = "phone must contain 11 digits"
  }
  if (
    !data.phone.startsWith("+3") &&
    !data.phone.startsWith("+7") &&
    data.phone.length > 1
  ) {
    phoneError = "phone must start  with '7' or '3'"
  }

  useEffect(() => {
    if (search.length > 0) {
      setDropdownServices(
        services
          .filter((service) => service.name !== "Day off")
          .filter((service) => service.name.toLowerCase().includes(search))
      )
    } else {
      setDropdownServices(
        services
          .filter((service) => service !== selectedService)
          .filter((service) => service.name !== "Day off")
      )
    }
  }, [search, selectedService, services])

  const findClient = async (data) => {
    if (data.phone.length > 1) {
      setClient(await clientService.getClientByPhone(data.phone))
    }
    if (data.instagram.length !== 0 && !client) {
      setClient(await clientService.getClientByInstagram(data.instagram))
    }
    if (data.telegram.length !== 0 && !client) {
      setClient(await clientService.getClientByTelegram(data.telegram))
    }
  }

  useEffect(() => {
    findClient(data)
  }, [data])

  const handleSelect = (service) => {
    handleClick(service)
    setSearch("")
  }

  const servicesDropdown = dropdownServices?.map((service) => (
    <div
      className="border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
      onClick={() => handleSelect(service)}
      key={service.id}
    >
      {service.name}
    </div>
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = localStorageService.getUserId()
    const currentUser = await userService.getUserById(userId)

    if (client) {
      await recordService.createNewRecord({
        userId: selectedUser.id,
        clientId: client?.id,
        serviceId: selectedService.id,
        date: selectedSlot.date,
        time: selectedSlot.start,
        author: currentUser?.name,
      })
      handleSelectedSlot(null)
      handleAddRecord()
      setData({
        phone: "+",
        instagram: "",
        telegram: "",
        name: "",
      })
      setClient(null)
      notify()
    } else {
      await recordService.createNewRecordWithRegister({
        userId: selectedUser.id,
        serviceId: selectedService.id,
        date: selectedSlot.date,
        time: selectedSlot.start,
        author: selectedUser?.name,
        phone: data.phone,
        instagram: data.instagram,
        telegram: data.telegram,
        name: data.name,
        authorId: userId,
      })
      handleSelectedSlot(null)
      handleAddRecord()
      setData({
        phone: "+",
        instagram: "",
        telegram: "",
        name: "",
      })
      setClient(null)
      notify()
    }
  }

  const handleChange = (target) => {
    if (target.name === "phone") {
      if (!data.phone.startsWith("+")) {
        setData((prevState) => ({
          ...prevState,
          [target.name]: "+" + target.value,
        }))
      } else {
        setData((prevState) => ({
          ...prevState,
          [target.name]: target.value,
        }))
      }
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }))
    }
  }

  return (
    <div className="h-full mt-[32px] rounded-lg border border-gray text-darkBrown px-[16px] py-[12px] max-md:mt-[10px]">
      {slotForChange ? (
        <DetailedRecordInfo
          recordId={slotForChange}
          handleClose={handleSelectedSlot}
          reset={reset}
        ></DetailedRecordInfo>
      ) : (
        <>
          <h3 className="font-bold mb-[20px]">
            {dictionary[selectedLanguage].editBooking}
          </h3>
          <p className="font-thin mb-[16px]">
            {dictionary[selectedLanguage].service}
          </p>
          <div className="flex justify-between items-center px-[16px] py-[14px] mb-[16px] border border-lightBrown text-lightBrown rounded-lg cursor-pointer relative">
            <div
              className={"w-full flex justify-between items-center"}
              onClick={handleShow}
            >
              <span className="hover:opacity-80">{selectedService?.name}</span>
              <img
                className={
                  !show ? "w-[16px] h-[16px]" : "w-[16px] h-[16px] rotate-180"
                }
                src={dropdownArrow}
                alt=""
              />
            </div>
            {show ? (
              <>
                <div className="w-full bg-wh border-gray rounded-lg border absolute top-[100%] left-0 opacity-100">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown rounded-t-lg"
                  />
                  {servicesDropdown}
                </div>
              </>
            ) : null}
          </div>
          {client ? (
            <>
              <p className="font-thin mb-[8px]">
                {dictionary[selectedLanguage].clientFound}
              </p>
              <div className="w-full py-2 px-3 border border-darkGreen rounded-lg text-darkGreen">
                {client.name.length !== 0 ? client.name : client.phone}{" "}
              </div>
            </>
          ) : null}
          <p className="font-thin mb-[8px]">
            {dictionary[selectedLanguage].clientsPhone}
          </p>
          <TextField
            name={"phone"}
            type={"text"}
            placeholder={"+71234567890"}
            value={data.phone}
            onChange={handleChange}
            error={phoneError}
          ></TextField>
          <p className="font-thin mb-[8px]">
            {dictionary[selectedLanguage].clientsInstagram}
          </p>
          <TextField
            name={"instagram"}
            type={"text"}
            placeholder={"instagram"}
            onChange={handleChange}
          ></TextField>
          <p className="font-thin mb-[8px]">
            {dictionary[selectedLanguage].clientsTelegram}
          </p>
          <TextField
            name={"telegram"}
            type={"text"}
            placeholder={"telegram"}
            onChange={handleChange}
          ></TextField>
          <p className="font-thin mb-[8px]">
            {dictionary[selectedLanguage].clientsName}
          </p>
          <TextField
            name={"name"}
            type={"text"}
            onChange={handleChange}
          ></TextField>
          <button
            className={`py-[12px] ${
              (!phoneError && selectedSlot && data.phone.length > 1) ||
              (selectedService?.name === "Day off" && selectedSlot)
                ? "text-brown bg-cream border-darkBrown"
                : "bg-white text-black border-gray"
            } border text-center rounded-lg w-full mt-[20px] hover:opacity-80`}
            disabled={
              (!phoneError && selectedSlot && data.phone.length > 1) ||
              (selectedService?.name === "Day off" && selectedSlot)
                ? false
                : true
            }
            onClick={handleSubmit}
          >
            {dictionary[selectedLanguage].confirmRecord}
          </button>
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
        </>
      )}
    </div>
  )
}

CrmRecordEditor.propTypes = {
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  services: PropTypes.array,
  records: PropTypes.array,
  clients: PropTypes.array,
  show: PropTypes.bool,
  handleClick: PropTypes.func,
  handleCancel: PropTypes.func,
  handleShow: PropTypes.func,
  handleSelectedSlot: PropTypes.func,
  handleAddRecord: PropTypes.func,
  selectedSlot: PropTypes.object,
  slotForChange: PropTypes.number,
  reset: PropTypes.func,
}

export default CrmRecordEditor
