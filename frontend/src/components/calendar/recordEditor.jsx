import PropTypes from "prop-types"
import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import React, { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import recordService from "../../services/record.service"
import localStorageService from "../../services/localStorage.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const RecordEditor = ({
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
  successNotify,
  errorNotify,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [search, setSearch] = useState("")
  const [serviceType, setServiceType] = useState(true)
  const [dropdownServices, setDropdownServices] = useState()
  const clientId = localStorageService.getClientId()
  useEffect(() => {
    if (serviceType) {
      if (search.length > 0) {
        setDropdownServices(
          services
            .filter(
              (service) =>
                !["Day off", "Odmar 1", "Odmar 2", "Odmar 4"].includes(
                  service.en
                )
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
                !["Day off", "Odmar 1", "Odmar 2", "Odmar 4"].includes(
                  service.en
                )
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
    await recordService.createNewRecord({
      userId: selectedUser.id,
      clientId: clientId,
      serviceId: selectedService?.id,
      date: selectedSlot.date,
      time: selectedSlot.start,
    })
    handleSelectedSlot(null)
    handleAddRecord()
  }

  const handleMassSubmit = async (e) => {
    e.preventDefault()
    const userId = localStorageService.getUserId()
    const records = selectedSlots?.map((slot) => {
      return {
        userId: slot.userId,
        serviceId: slot.serviceId,
        date: slot.date,
        time: slot.start,
      }
    })
    const response = await recordService.createNewComplex({
      author: selectedUser?.name,
      clientId: clientId,
      records: records,
    })
    if (response === "Success") {
      successNotify()
    } else {
      errorNotify()
    }
    handleMassAddRecord()
  }

  return (
    <div className="h-full mt-[32px] rounded-lg border border-gray text-darkBrown px-[16px] py-[12px] max-md:mt-[10px]">
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
      <div className="flex justify-between items-center px-[16px] py-[14px] border border-gray rounded-lg cursor-pointer relative">
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
            <div className="w-full bg-white border-gray rounded-lg border absolute top-[100%] left-0 opacity-100 overflow-y-scroll max-h-[300px]">
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
      <button
        className={`py-[12px] ${
          selectedSlot
            ? "text-brown bg-cream border-darkBrown"
            : "bg-white text-black border-gray"
        } border text-center rounded-lg w-full mt-[20px] hover:opacity-80`}
        disabled={
          selectedSlot === null &&
          selectedSlots?.length !== selectedComplex?.services?.length
        }
        onClick={selectedComplex ? handleMassSubmit : handleSubmit}
      >
        {dictionary[selectedLanguage].record}
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
    </div>
  )
}

RecordEditor.propTypes = {
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  services: PropTypes.array,
  show: PropTypes.bool,
  handleSelectService: PropTypes.func,
  handleShow: PropTypes.func,
  handleSelectedSlot: PropTypes.func,
  selectedSlot: PropTypes.object,
  handleAddRecord: PropTypes.func,
}

export default RecordEditor
