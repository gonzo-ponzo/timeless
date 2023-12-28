import PropTypes from "prop-types"
import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import React, { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
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
  selectedComplex,
  services,
  complexes,
  show,
  handleSelectService,
  handleSelectComplex,
  handleMassAddRecord,
  handleShow,
  selectedSlot,
  selectedSlots,
  selectedUser,
  handleSelectedSlot,
  handleAddRecord,
  slotForChange,
  successNotify,
  errorNotify,
  reset,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [client, setClient] = useState(null)
  const [search, setSearch] = useState("")
  const [serviceType, setServiceType] = useState(true)
  const [dropdownServices, setDropdownServices] = useState()
  const [data, setData] = useState({
    phone: "+",
    instagram: "",
    telegram: "",
    name: "",
  })
  const phoneValid =
    /^\+3\d{10}$/.test(data.phone) ||
    /^\+3\d{11}$/.test(data.phone) ||
    /^\+7\d{10}$/.test(data.phone)

  let phoneError
  if (
    data.phone.startsWith("+3") &&
    !(/^\+3\d{10}$/.test(data.phone) || /^\+3\d{11}$/.test(data.phone))
  ) {
    phoneError = "phone must contain 11-12 digits"
  }
  if (data.phone.startsWith("+7") && !/^\+7\d{10}$/.test(data.phone)) {
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
    if (serviceType) {
      if (search.length > 0) {
        setDropdownServices(
          services
            .filter(
              (service) =>
                ![
                  "Day off",
                  "Odmar 1",
                  "Odmar 2",
                  "Odmar 4",
                  "Odmar 0.5",
                ].includes(service.en)
            )
            .filter((service) =>
              service[selectedLanguage]
                .toLowerCase()
                .includes(search.toLowerCase())
            )
        )
      } else {
        setDropdownServices(
          services
            .filter((service) => service !== selectedService)
            .filter(
              (service) =>
                ![
                  "Day off",
                  "Odmar 1",
                  "Odmar 2",
                  "Odmar 4",
                  "Odmar 0.5",
                ].includes(service.en)
            )
        )
      }
    } else {
      if (search.length > 0) {
        setDropdownServices(
          complexes.filter((complex) =>
            complex?.[selectedLanguage]
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        )
      } else {
        setDropdownServices(
          complexes.filter((complex) => complex?.id !== selectedComplex?.id)
        )
      }
    }
  }, [
    search,
    selectedService,
    selectedComplex,
    services,
    complexes,
    serviceType,
  ])

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

  const onSelectService = (service) => {
    if (service?.services) {
      handleSelectComplex(service)
    } else {
      handleSelectComplex(null)
      handleSelectService(service)
    }
    setSearch("")
  }

  const servicesDropdown = dropdownServices?.map((service) => (
    <div
      className="border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
      onClick={() => onSelectService(service)}
      key={service.id}
    >
      {service[selectedLanguage]}
    </div>
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = localStorageService.getUserId()
    const currentUser = await userService.getUserById(userId)

    if (client) {
      const result = await recordService.createNewRecord({
        userId: selectedUser.id,
        clientId: client?.id,
        serviceId: selectedService.id,
        date: selectedSlot.date,
        time: selectedSlot.start,
        author: currentUser?.name,
      })
      if (result === "Success") {
        successNotify()
      } else {
        errorNotify()
      }
      handleSelectedSlot(null)
      handleAddRecord()
      setData({
        phone: "+",
        instagram: "",
        telegram: "",
        name: "",
      })
      setClient(null)
    } else {
      const result = await recordService.createNewRecordWithRegister({
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
      if (result === "Success") {
        successNotify()
      } else {
        errorNotify()
      }
      handleSelectedSlot(null)
      handleAddRecord()
      setData({
        phone: "+",
        instagram: "",
        telegram: "",
        name: "",
      })
      setClient(null)
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

  const handleMassSubmit = async (e) => {
    e.preventDefault()
    const userId = localStorageService.getUserId()
    const selectedUser = await userService.getUserById(userId)
    const records = selectedSlots?.map((slot) => {
      return {
        userId: slot.userId,
        serviceId: slot.serviceId,
        date: slot.date,
        time: slot.start,
      }
    })
    if (client) {
      const response = await recordService.createNewComplex({
        author: selectedUser?.name,
        clientId: client?.id,
        records: records,
      })
      if (response === "Success") {
        successNotify()
      } else {
        errorNotify()
      }
    } else {
      const response = await recordService.createNewComplexWithRegister({
        records: records,
        author: selectedUser?.name,
        phone: data.phone,
        instagram: data.instagram,
        telegram: data.telegram,
        name: data.name,
        authorId: userId,
      })
      if (response === "Success") {
        successNotify()
      } else {
        errorNotify()
      }
    }
    handleMassAddRecord()
    setData({
      phone: "+",
      instagram: "",
      telegram: "",
      name: "",
    })
    setClient(null)
  }

  return (
    <div className="h-full mt-[32px] rounded-lg border border-gray text-darkBrown px-[16px] py-[12px] max-md:mt-[10px]">
      {slotForChange ? (
        <DetailedRecordInfo
          recordId={slotForChange}
          handleClose={handleSelectedSlot}
          reset={reset}
          successNotify={successNotify}
          errorNotify={errorNotify}
        ></DetailedRecordInfo>
      ) : (
        <>
          <h3 className="font-bold mb-[20px]">
            {dictionary[selectedLanguage].editBooking}
          </h3>
          <p>
            {selectedComplex
              ? selectedSlots?.length !== selectedComplex?.services?.length
                ? `${dictionary[selectedLanguage]?.currentSelection} "${selectedService?.[selectedLanguage]}"`
                : `${dictionary[selectedLanguage].confirmComplex}`
              : null}
          </p>
          <p className="font-thin mb-[16px]">
            {dictionary[selectedLanguage].service}
          </p>
          <div className="flex justify-between items-center px-[16px] py-[14px] mb-[16px] border border-lightBrown text-lightBrown rounded-lg cursor-pointer relative">
            <div
              className={"w-full flex justify-between items-center"}
              onClick={handleShow}
            >
              <span className="hover:opacity-80">
                {selectedComplex
                  ? selectedComplex?.[selectedLanguage]
                  : selectedService?.[selectedLanguage]}
              </span>
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
                <div className="w-full bg-wh border-gray rounded-lg border absolute top-[100%] left-0 opacity-100 overflow-y-scroll max-h-[300px]">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown rounded-t-lg"
                  />
                  <div
                    className=" flex justify-between border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
                    onClick={() => setServiceType(!serviceType)}
                  >
                    <span className={`${serviceType ? "order-last" : ""}`}>
                      {serviceType
                        ? dictionary[selectedLanguage].complex
                        : dictionary[selectedLanguage].service}
                    </span>
                    <img
                      className={`${serviceType ? "-rotate-90" : "rotate-90"}`}
                      src={dropdownArrow}
                      alt=""
                    />
                  </div>
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
              ([
                "Day off",
                "Odmar 1",
                "Odmar 2",
                "Odmar 4",
                "Odmar 0.5",
              ].includes(selectedService?.en) &&
                selectedSlot)
                ? "text-brown bg-cream border-darkBrown"
                : "bg-white text-black border-gray"
            } border text-center rounded-lg w-full mt-[20px] hover:opacity-80`}
            disabled={
              (!phoneError &&
                selectedSlot &&
                data.phone.length > 1 &&
                phoneValid) ||
              [
                "Day off",
                "Odmar 1",
                "Odmar 2",
                "Odmar 4",
                "Odmar 0.5",
              ].includes(selectedService?.en) ||
              (!phoneError &&
                selectedSlots?.length === selectedComplex?.services?.length &&
                data.phone.length > 1 &&
                selectedSlots)
                ? false
                : true
            }
            onClick={selectedComplex ? handleMassSubmit : handleSubmit}
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
  complexes: PropTypes.array,
  records: PropTypes.array,
  clients: PropTypes.array,
  show: PropTypes.bool,
  handleSelectService: PropTypes.func,
  handleCancel: PropTypes.func,
  handleShow: PropTypes.func,
  handleSelectedSlot: PropTypes.func,
  handleSelectSlots: PropTypes.func,
  handleAddRecord: PropTypes.func,
  handleMassAddRecord: PropTypes.func,
  selectedSlot: PropTypes.object,
  selectedSlots: PropTypes.array,
  slotForChange: PropTypes.number,
  successNotify: PropTypes.func,
  errorNotify: PropTypes.func,
  reset: PropTypes.func,
}

export default CrmRecordEditor
