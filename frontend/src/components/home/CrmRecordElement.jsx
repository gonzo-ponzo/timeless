import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Close from "../../assets/imgs/plus-circle.png"
import TextField from "../textField"
import recordService from "../../services/record.service"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom"
import serviceService from "../../services/service.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const CrmRecordElement = ({ record, lastEl, clients, records }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const [selectedImage, setSelectedImage] = useState()
  const [selectedPreview, setSelectedPreview] = useState(null)
  const [services, setServices] = useState(null)
  const [blur, setBlur] = useState(false)
  const client = clients?.find((client) => client.id === record.clientId)
  const loadData = async () => {
    setServices(await serviceService.getServices())
  }
  useEffect(() => {
    loadData()
  }, [])
  const recordServices = services
    ? services.filter((service) => record.services.includes(Number(service.id)))
    : []

  let recordServicesName = ""
  let recordServicesPrice = 0
  for (let i = 0; i < recordServices.length; i++) {
    recordServicesPrice = recordServicesPrice + recordServices[i].price
    recordServicesName =
      recordServicesName +
      `${recordServices[i].name}${i === recordServices.length - 1 ? "" : "/"}`
  }

  const [data, setData] = useState({
    price: 0,
    comment: "",
    status: "completed",
  })

  const handleClick = () => {
    setBlur(!blur)
  }

  const handleSubmit = async () => {
    const recordId = record.id
    await recordService.UpdateRecord({
      recordId,
      price: data.price,
      status: data.status,
      comment: data.comment,
    })
    if (selectedImage) {
      const formData = new FormData()
      formData.append("image", selectedImage)
      await recordService.UploadRecordImage(recordId, formData)
    }
    notify()
    setBlur(!blur)
    records[records.findIndex((record) => record.id === recordId)].status =
      "completed"
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setSelectedPreview(url)
    setSelectedImage(file)
  }

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }
  if (record.name === "Day off") {
    return
  }

  return (
    <>
      <div
        onClick={record.status === "created" ? handleClick : null}
        className={
          lastEl
            ? "grid grid-cols-5 border border-gray cursor-pointer hover:opacity-70 rounded-b-lg"
            : "grid grid-cols-5 border border-gray cursor-pointer hover:opacity-70"
        }
      >
        <Link to={`/crm/client/${client?.id}`}>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {client?.name}
          </div>
        </Link>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {recordServicesName}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {recordServicesPrice}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record.time.slice(0, 5)}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record.status}
        </div>
      </div>
      <span
        className={
          !blur
            ? "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] max-md:top-[-278px] collapse"
            : "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] max-md:top-[-278px]"
        }
      >
        <div className="w-[600px]">
          <div className="flex justify-between w-full mb-[16px]">
            <h3 className="text-white text-base">
              {dictionary[selectedLanguage].closeRecord}
            </h3>
            <img
              className="cursor-pointer"
              onClick={handleClick}
              src={Close}
              alt=""
            />
          </div>
          <label className="text-white" htmlFor="price">
            {dictionary[selectedLanguage].finalPrice}
          </label>
          <TextField
            name={"price"}
            type={"number"}
            onChange={handleChange}
          ></TextField>
          <label className="mt-[16px] text-white" htmlFor="comment">
            {dictionary[selectedLanguage].comment}
          </label>
          <TextField
            name={"comment"}
            type={"text"}
            area={true}
            onChange={handleChange}
          ></TextField>
          <input
            className="py-2 px-3 mb-[16px] block w-full text-sm text-lightBrown placeholder-lightBrown border border-lightBrown rounded-lg cursor-pointer bg-white focus:outline-none file:text-brown file:bg-cream file:rounded-lg file:border-lightBrown file:outline-none file:border file:hover:opacity-80 file:cursor-pointer"
            id={"file"}
            name={"file"}
            accept="image/*"
            capture
            type={"file"}
            placeholder={""}
            onChange={handleImageChange}
          />
          {selectedPreview ? (
            <img
              src={selectedPreview}
              alt=""
              className="w-full mx-auto my-[16px]"
            />
          ) : null}

          <button
            className="bg-black text-white px-[12px] py-[10px] items-end rounded-lg hover:opacity-80 max-md:w-full"
            onClick={handleSubmit}
          >
            {dictionary[selectedLanguage].send}
          </button>
        </div>
      </span>
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
  )
}

CrmRecordElement.propTypes = {
  record: PropTypes.object.isRequired,
  lastEl: PropTypes.bool,
  records: PropTypes.array,
}

export default CrmRecordElement
