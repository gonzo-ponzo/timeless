import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import telegramLogo from "../../assets/imgs/telegram.png"
import phoneLogo from "../../assets/imgs/Vector.png"
import TextField from "../textField"
import recordService from "../../services/record.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"
import userService from "../../services/user.service"
import clientService from "../../services/client.service"
import commentService from "../../services/comment.service"
import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import Close from "../../assets/imgs/Close-icon.png"
import StatusButton from "./statusButton"

const DetailedRecordInfo = ({ recordId, handleClose, reset, currentUser }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [records, setRecords] = useState(null)
  const [clients, setClients] = useState(null)
  const [users, setUsers] = useState(null)
  const [comments, setComments] = useState(null)
  const [showMaster, setShowMaster] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState()
  const [selectedMaster, setSelectedMaster] = useState()
  const [selectedMasterId, setSelectedMasterId] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTime, setSelectedTime] = useState()

  const [data, setData] = useState({
    price: 0,
    comment: "",
    status: "completed",
    masterId: null,
  })
  const loadData = async () => {
    setRecords(await recordService.getRecords())
    setClients(await clientService.getClients())
    setUsers(await userService.getUsers())
    setComments(await commentService.getComments())
  }
  useEffect(() => {
    loadData()
  }, [recordId])

  const record = records?.find((record) => record.id === recordId)
  useEffect(() => {
    if (record) {
      setData((prevState) => ({ ...prevState, status: record.status }))
      setSelectedDate(record.date)
      setSelectedTime(record.time)
      setSelectedStatus(record.status)
      setSelectedMaster(users?.find((user) => user.id === record.users[0]).name)
      setSelectedMasterId(record.users[0])
    }
  }, [record, recordId])

  const client = clients?.find((client) => client.id === record.clientId)

  const handleSelectStatus = (status) => {
    setSelectedStatus(status)
    setData((prevState) => ({ ...prevState, status: selectedStatus }))
  }

  const handleSelectMaster = (master) => {
    setSelectedMaster(master.name)
    setSelectedMasterId(master.id)
    setData((prevState) => ({ ...prevState, masterId: selectedMasterId }))
    setShowMaster(!showMaster)
  }

  const masterDropdown = users
    ?.filter((user) => user.isStaff)
    .map((master) => (
      <div
        className="border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
        onClick={() => handleSelectMaster(master)}
        key={master}
      >
        {master.name}
      </div>
    ))
  const user = users?.find((user) => record.users.includes(user.id))

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const comment = comments?.find((comment) => comment.recordId === record?.id)
  const [commentClient, setCommentClient] = useState(null)
  const loadClient = async (comment) => {
    if (comment) {
      setCommentClient(await clientService.getClientById(comment.clientId))
    }
  }
  useEffect(() => {
    loadClient(comment)
  }, [comment])

  const handleSubmit = async () => {
    const recordId = record.id
    await recordService.UpdateRecord({
      recordId: recordId,
      price: data.price,
      comment: data.comment,
      status: selectedStatus,
      time: selectedTime,
      date: selectedDate,
      userId: user?.id,
      masterId: selectedMasterId,
    })
    records[records.findIndex((record) => record.id === recordId)].status =
      selectedStatus
    reset(Math.random())
  }

  return (
    <div className="text-brown">
      <h3 className="mb-[4px] flex justify-between">
        #{record?.id}{" "}
        <button onClick={() => handleClose(null)}>
          <img
            className="cursor-pointer w-[20px] h-[20px]"
            src={Close}
            alt=""
          />
        </button>
      </h3>
      <div className="flex justify-between">
        <p className="font-bold text-lg mb-[4px] text-darkBrown">
          {record?.name}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <Link to={"/crm/client/" + client?.id}>
            <div className="flex items-center justify-start mb-[4px]">
              <p className="text-darkBrown">{client?.name}</p>
            </div>
          </Link>
          {currentUser?.isAdmin && !currentUser.isStaff ? (
            <>
              <p className="text-darkBrown flex items-center justify-start mb-[4px]">
                <a
                  className="flex justify-start items-center"
                  href={`http://www.t.me/${client?.telegram}`}
                >
                  <img
                    className="h-[16px] w-[16px] mr-[8px]"
                    src={telegramLogo}
                    alt=""
                  />
                  {client?.telegram}
                </a>
              </p>
              <p className="text-darkBrown flex items-center justify-start mb-[8px]">
                <img
                  className="h-[16px] w-[16px] mr-[8px]"
                  src={phoneLogo}
                  alt=""
                />
                <a href={`tel:${client?.phone}`}>{client?.phone}</a>
              </p>
            </>
          ) : null}
        </div>
        {client?.image ? (
          <img
            className="rounded-full w-[75px] h-[75px]"
            src={client.image}
            alt=""
          />
        ) : null}
      </div>

      <p className="font-thin mb-[4px]">
        {dictionary[selectedLanguage].author}
      </p>
      <p className="mb-[16px] text-darkBrown">
        {record?.author
          ? record.author
          : `${dictionary[selectedLanguage].clientHimself}`}
      </p>
      <p className="font-thin mb-[4px]">
        {dictionary[selectedLanguage].status}: {record?.status}
      </p>
      <div className="w-full flex items-center justify-start pb-[12px]">
        <StatusButton
          type={"completed"}
          handleSelectStatus={handleSelectStatus}
          selectedStatus={selectedStatus}
        ></StatusButton>
        <StatusButton
          type={"created"}
          handleSelectStatus={handleSelectStatus}
          selectedStatus={selectedStatus}
        ></StatusButton>
        <StatusButton
          type={"canceled"}
          handleSelectStatus={handleSelectStatus}
          selectedStatus={selectedStatus}
        ></StatusButton>
      </div>
      {selectedStatus === "completed" ? (
        <TextField
          name={"price"}
          type={"number"}
          placeholder={dictionary[selectedLanguage].price}
          onChange={handleChange}
        ></TextField>
      ) : null}

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        disabled={record?.status === "completed" ? true : false}
        className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px] my-[8px]"
      />

      <input
        type="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        disabled={record?.status === "completed" ? true : false}
        className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px]"
      />

      <p className="font-thin mb-[4px]">
        {dictionary[selectedLanguage].master}
      </p>

      {currentUser?.isAdmin ? (
        <div className="flex justify-between items-center px-[8px] py-[7px] mb-[8px] border border-lightBrown text-lightBrown rounded-lg cursor-pointer relative">
          <div
            className={"w-full flex justify-between items-center"}
            onClick={() =>
              record?.status === "created" ? setShowMaster(!showMaster) : null
            }
          >
            <span className="hover:opacity-80">
              {selectedMaster ? selectedMaster : user?.name}
            </span>
            <img
              className={
                !showMaster
                  ? "w-[16px] h-[16px]"
                  : "w-[16px] h-[16px] rotate-180"
              }
              src={dropdownArrow}
              alt=""
            />
          </div>
          {showMaster ? (
            <>
              <div className="w-full bg-wh border-gray rounded-lg border absolute top-[100%] left-0 opacity-100">
                {masterDropdown}
              </div>
            </>
          ) : null}
        </div>
      ) : users ? (
        <p className="text-darkBrown mb-[4px]">
          {
            Object.values(users).filter(
              (user) => user.id === record.users[0]
            )[0].name
          }
        </p>
      ) : null}

      <p className="font-thin mb-[4px]">
        {dictionary[selectedLanguage].feedback}
      </p>

      <TextField
        name={"comment"}
        type={"text"}
        area={true}
        placeholder={dictionary[selectedLanguage].comment}
        disabled={record?.status === "completed" ? true : false}
        onChange={handleChange}
      ></TextField>
      <button
        className="bg-cream text-brown border border-darkBrown px-[12px] py-[10px] mb-[8px] items-end rounded-lg hover:opacity-80"
        onClick={handleSubmit}
        disabled={!data.price && selectedStatus === "completed" ? true : false}
      >
        {dictionary[selectedLanguage].confirm}
      </button>
      {comment?.clientId ? (
        <div className="border w-full border-gray flex p-[5px] rounded-lg items-start">
          <img
            className="w-[26px] h-[26px] rounded-full mr-[6px]"
            src={commentClient?.image}
            alt=""
          />
          <div className="w-full flex flex-col">
            <p className="font-bold">{commentClient?.name}</p>
            <p>{comment?.content}</p>
            {comment?.image ? (
              <img
                className="max-h-[100px] max-w-[100px]"
                src={comment?.image}
                alt=""
              />
            ) : null}
            <p className="w-full text-sm font-thin flex justify-end">
              {comment?.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

DetailedRecordInfo.propTypes = {
  recordId: PropTypes.number,
  handleClose: PropTypes.func,
  setUpdatedRecords: PropTypes.func,
  currentUser: PropTypes.object,
}

export default DetailedRecordInfo
