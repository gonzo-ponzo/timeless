import React, { useState } from "react"
import PropTypes from "prop-types"
import Close from "../../assets/imgs/plus-circle.png"
import Rating from "react-rating"
import starFull from "../../assets/imgs/star-full.png"
import starEmpty from "../../assets/imgs/star-empty.png"
import commentService from "../../services/comment.service"
import localStorageService from "../../services/localStorage.service"
import { toast } from "react-toastify"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientRecordElement = ({ record, lastEl, services }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const [selectedImage, setSelectedImage] = useState()
  const [selectedPreview, setSelectedPreview] = useState(null)
  const [selectedRating, setSelectedRating] = useState()
  const [comment, setComment] = useState("")
  const [blur, setBlur] = useState(false)

  const onRatingSelected = (selectedValue) => {
    setSelectedRating(selectedValue)
  }
  const handleClick = () => {
    setBlur(!blur)
  }

  const handleSubmit = async () => {
    const clientId = localStorageService.getClientId()

    const { data } = await commentService.createComment(
      clientId,
      null,
      record.id,
      comment,
      selectedRating
    )
    if (selectedImage) {
      const formData = new FormData()
      formData.append("image", selectedImage)
      await commentService.UploadCommentImage(data.commentId, formData)
    }
    notify()
    setBlur(!blur)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setSelectedPreview(url)
    setSelectedImage(file)
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={
          lastEl
            ? "grid grid-cols-4 border border-gray rounded-b-lg hover:opacity-70 cursor-pointer"
            : "grid grid-cols-4 border border-gray hover:opacity-70 cursor-pointer"
        }
      >
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record?.user?.name}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record?.service?.[selectedLanguage]}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record?.service?.price}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
          {record.time.slice(0, 5)}
        </div>
      </div>
      <span
        className={
          !blur
            ? "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] max-md:top-[-270px] collapse"
            : "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] max-md:top-[-278px]"
        }
      >
        <div className="w-[600px]">
          <div className="flex justify-between w-full mt-[16px]">
            <h3 className="text-white text-base">
              {dictionary[selectedLanguage].leaveFeedback}
            </h3>
            <img
              className="cursor-pointer"
              onClick={handleClick}
              src={Close}
              alt=""
            />
          </div>
          <textarea
            onChange={(event) => setComment(event.target.value)}
            className="w-full bg-white rounded-lg text-black p-[10px] outline-none mb-[16px]"
          ></textarea>
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
          <div className="flex justify-between">
            <Rating
              initialRating={selectedRating}
              onClick={onRatingSelected}
              emptySymbol={
                <img src={starEmpty} alt="empty star" className="icon" />
              }
              fullSymbol={
                <img src={starFull} alt="fullfilled star" className="icon" />
              }
            />
            <button
              className="bg-black text-white px-[12px] py-[10px] rounded-lg hover:opacity-80"
              onClick={handleSubmit}
              disabled={!selectedRating}
            >
              Отправить
            </button>
          </div>
        </div>
      </span>
    </>
  )
}

ClientRecordElement.propTypes = {
  record: PropTypes.object.isRequired,
  lastEl: PropTypes.bool,
  services: PropTypes.array,
}

export default ClientRecordElement
