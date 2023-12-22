import PropTypes from "prop-types"
import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import recordService from "../../services/record.service"
import localStorageService from "../../services/localStorage.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const RecordEditor = ({
  selectedService,
  services,
  show,
  handleClick,
  handleShow,
  selectedSlot,
  selectedUser,
  handleAddRecord,
  handleSelectedSlot,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const clientId = localStorageService.getClientId()
  const [data, setData] = useState("")
  const [dropdownServices, setDropdownServices] = useState()
  useEffect(() => {
    if (data.length > 0) {
      setDropdownServices(
        services.filter((service) =>
          service.name.toLowerCase().includes(data.toLowerCase())
        )
      )
    } else {
      setDropdownServices(
        services.filter((service) => service !== selectedService)
      )
    }
  }, [data, selectedService, services])

  const handleSelect = (service) => {
    handleClick(service)
    setData("")
  }
  const servicesDropdown = dropdownServices
    ? dropdownServices.map((service) => (
        <div
          className="border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
          onClick={() => handleSelect(service)}
          key={service.id}
        >
          {service.name}
        </div>
      ))
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    await recordService.createNewRecord({
      userId: selectedUser.id,
      clientId: clientId,
      serviceId: selectedService.id,
      date: selectedSlot.date,
      time: selectedSlot.start,
    })
    handleSelectedSlot(null)
    handleAddRecord()
    notify()
  }

  return (
    <div className="h-full mt-[32px] rounded-lg border border-gray text-darkBrown px-[16px] py-[12px] max-md:mt-[10px]">
      <h3 className="font-bold mb-[20px]">
        {dictionary[selectedLanguage].editBooking}
      </h3>
      <p className="font-thin mb-[16px]">
        {dictionary[selectedLanguage].service}
      </p>
      <div className="flex justify-between items-center px-[16px] py-[14px] border border-gray rounded-lg cursor-pointer relative">
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
            <div className="w-full bg-white border-gray rounded-lg border absolute top-[100%] left-0 opacity-100 overflow-y-scroll max-h-[300px]">
              <input
                type="text"
                name="search"
                placeholder="Search"
                onChange={(e) => setData(e.target.value)}
                className="w-full border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown rounded-t-lg"
              />
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
        disabled={selectedSlot === null}
        onClick={handleSubmit}
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
  handleClick: PropTypes.func,
  handleShow: PropTypes.func,
  handleSelectedSlot: PropTypes.func,
  selectedSlot: PropTypes.object,
  handleAddRecord: PropTypes.func,
}

export default RecordEditor
