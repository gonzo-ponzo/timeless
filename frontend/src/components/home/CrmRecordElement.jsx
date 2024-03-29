import React, { useState } from "react"
import PropTypes from "prop-types"
import Close from "../../assets/imgs/plus-circle.png"
import TextField from "../textField"
import recordService from "../../services/record.service"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link } from "react-router-dom"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"
import localStorageService from "../../services/localStorage.service"

const CrmRecordElement = ({ record, lastEl, clients, records, setReset }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const [selectedImage, setSelectedImage] = useState()
  const [selectedPreview, setSelectedPreview] = useState(null)
  const [blur, setBlur] = useState(false)
  const client = clients?.find((client) => client.id === record.clientId)
  const windowWidth = window.innerWidth
  const userId = localStorageService.getUserId()

  const [data, setData] = useState({
    price: 0,
    comment: "",
    status: "completed",
    cameFrom: null,
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
      cameFrom: data.cameFrom,
      userId: userId,
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
    setReset(Math.random())
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
  if (
    ["Day off", "Odmar 1", "Odmar 2", "Odmar 4", "Odmar 0.5"].includes(
      record?.service?.en
    )
  ) {
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
          {record?.service?.[selectedLanguage]}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record?.service?.price}{" "}
          {record.status === "completed" ? <b>({record?.price})</b> : null}
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
          {client?.cameFrom ? null : (
            <>
              <label className="mt-[16px] text-white" htmlFor="cameFrom">
                {dictionary[selectedLanguage].cameFrom}
              </label>
              <TextField
                name={"cameFrom"}
                type={"text"}
                area={true}
                onChange={handleChange}
              ></TextField>
            </>
          )}
          <input
            className="py-2 px-3 mb-[16px] block w-full text-sm text-lightBrown placeholder-lightBrown border border-lightBrown rounded-lg cursor-pointer bg-white focus:outline-none file:text-brown file:bg-cream file:rounded-lg file:border-lightBrown file:outline-none file:border file:hover:opacity-80 file:cursor-pointer"
            id={"file"}
            name={"file"}
            accept={windowWidth < 800 ? "image/*, file/*" : "image/*"}
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
  setReset: PropTypes.func,
}

export default CrmRecordElement
