import React, { useState } from "react"
import PropTypes from "prop-types"
import star from "../../assets/imgs/Star 6.png"
import { Link } from "react-router-dom"
import Close from "../../assets/imgs/plus-circle.png"
import Rating from "react-rating"
import starEmpty from "../../assets/imgs/star-empty.png"
import starFull from "../../assets/imgs/star-full.png"
import localStorageService from "../../services/localStorage.service"
import commentService from "../../services/comment.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientElement = ({ client, records, comments, lastEl }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const recordIndexes = records.map((record) => record.id)
  const recordIndexesWithComment = []
  comments.forEach((comment) => {
    if (recordIndexes.includes(comment.recordId)) {
      recordIndexesWithComment.push(comment.recordId)
    }
  })
  const recordsWithoutComment = records.filter(
    (record) =>
      !recordIndexesWithComment.includes(record.id) &&
      !["Day off", "Odmar 1", "Odmar 2", "Odmar 4", "Odmar 0.5"].includes(
        record?.service?.en
      ) &&
      record.clientId === client.id
  )
  const recordsElements = recordsWithoutComment.map((record) => (
    <div
      className=" grid grid-cols-4 cursor-pointer mb-[4px] opacity-70 hover:opacity-100"
      onClick={() => setSelectedRecord(record)}
    >
      <p className="col-span-2">{record?.service[selectedLanguage]}</p>
      <p className="">{record.date}</p>
      <p className="">{record.time.slice(0, 5)}</p>
    </div>
  ))

  const [blur, setBlur] = useState(false)
  const [selectedRating, setSelectedRating] = useState()
  const [comment, setComment] = useState("")
  const onRatingSelected = (selectedValue) => {
    setSelectedRating(selectedValue)
  }

  const handleClick = () => {
    setBlur(!blur)
    setSelectedRecord(null)
  }

  const handleSubmit = async () => {
    const userId = localStorageService.getUserId()

    await commentService.createComment(
      null,
      userId,
      selectedRecord.id,
      comment,
      selectedRating
    )
    setBlur(!blur)
  }
  return (
    <>
      <div
        className={
          lastEl
            ? "grid grid-cols-3 text-darkBrown border border-gray rounded-b-lg  max-md:grid-cols-5"
            : "grid grid-cols-3 text-darkBrown border border-gray  max-md:grid-cols-5"
        }
        key={client.id}
      >
        <Link to={"/crm/client/" + client.id} className="max-md:col-span-2">
          <div className="py-[12px] px-[20px] flex max-md:py-[6px] max-md:px-[10px]">
            {client.image ? (
              <img
                className="h-[26px] w-[26px] mr-[5px] max-md:hidden"
                src={client.image}
                alt=""
              />
            ) : null}
            {client.name}
          </div>
        </Link>
        <div className="py-[12px] px-[20px] flex max-md:py-[6px] max-md:px-[10px]">
          <img
            className="w-[20px] h-[20px] mr-[5px] items-center"
            src={star}
            alt=""
          />
          {client.rating}
        </div>
        <button
          className="py-[12px] px-[20px] text-start hover:opacity-80 max-md:py-[6px] max-md:px-[10px] max-md:col-span-2"
          onClick={handleClick}
        >
          {dictionary[selectedLanguage].feedbackClient}
        </button>
        <span
          className={
            !blur
              ? "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] collapse max-md:top-[-278px]"
              : "w-screen h-screen flex justify-center items-center backdrop-blur-lg bg-transparent absolute z-[100] left-0 top-[-252px] max-md:top-[-278px]"
          }
        >
          <div className="w-[600px]">
            <div className="flex justify-between w-full mb-[16px]">
              <h3 className="text-white text-base">
                {selectedRecord
                  ? dictionary[selectedLanguage].giveFeedback
                  : dictionary[selectedLanguage].selectRecord}
              </h3>
              <img
                className="cursor-pointer"
                onClick={(ev) => handleClick(ev)}
                src={Close}
                alt=""
              />
            </div>
            {selectedRecord ? (
              <p
                className="text-white mb-[10px] cursor-pointer"
                onClick={() => setSelectedRecord(null)}
              >
                {dictionary[selectedLanguage].back}
              </p>
            ) : null}
            {selectedRecord ? (
              <>
                <textarea
                  onChange={(event) => setComment(event.target.value)}
                  className="w-full bg-white rounded-lg text-black p-[10px] outline-none mb-[16px]"
                ></textarea>
                <div className="flex justify-between">
                  <Rating
                    initialRating={selectedRating}
                    onClick={onRatingSelected}
                    emptySymbol={
                      <img src={starEmpty} alt="empty star" className="icon" />
                    }
                    fullSymbol={
                      <img
                        src={starFull}
                        alt="fullfilled star"
                        className="icon"
                      />
                    }
                  />
                  <button
                    className="bg-black text-white px-[12px] py-[10px] rounded-lg hover:opacity-80"
                    onClick={handleSubmit}
                  >
                    {dictionary[selectedLanguage].confirm}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-[12px]">
                <div className=" grid grid-cols-4 mb-[6px]">
                  <p className="col-span-2 font-bold">
                    {dictionary[selectedLanguage].theRecord}
                  </p>
                  <p className="font-bold">
                    {dictionary[selectedLanguage].date}
                  </p>
                  <p className="font-bold">
                    {dictionary[selectedLanguage].time}
                  </p>
                </div>
                {recordsElements}
              </div>
            )}
          </div>
        </span>
      </div>
    </>
  )
}

ClientElement.propTypes = {
  client: PropTypes.object.isRequired,
  records: PropTypes.array,
  comments: PropTypes.array,
  lastEl: PropTypes.bool,
}

export default ClientElement
