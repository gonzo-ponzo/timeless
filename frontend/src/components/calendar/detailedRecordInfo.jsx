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
import Mute from "../../assets/imgs/mute.png"

const DetailedRecordInfo = ({
  recordId,
  handleClose,
  reset,
  currentUser,
  successNotify,
  errorNotify,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [records, setRecords] = useState(null)
  const [clients, setClients] = useState(null)
  const [users, setUsers] = useState(null)
  const [comments, setComments] = useState(null)
  const [showMaster, setShowMaster] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
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
    cameFrom: null,
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
  const historyList = record?.history
    ? Object.keys(record?.history)
        .reverse()
        .map((key) => (
          <p className="mb-[2px]">
            <b>{key}:</b> {record?.history[key]}
          </p>
        ))
    : null

  useEffect(() => {
    if (record) {
      setData((prevState) => ({ ...prevState, status: record.status }))
      setSelectedDate(record.date)
      setSelectedTime(record.time)
      setSelectedStatus(record.status)
      setSelectedMaster(users?.find((user) => user.id === record.userId).name)
      setSelectedMasterId(record.userId)
    }
  }, [record, recordId, users])

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
    .filter((user) => user?.services.includes(record?.serviceId))
    .map((master) => (
      <div
        className="border-b border-gray px-[16px] py-[7px] bg-white text-brown cursor-pointer hover:text-lightBrown last:border-none last:rounded-b-lg first:rounded-t-lg"
        onClick={() => handleSelectMaster(master)}
        key={master}
      >
        {master?.name}
      </div>
    ))
  const user = users?.find((user) => record.userId === user.id)

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = async () => {
    const recordId = record.id
    const result = await recordService.UpdateRecord({
      recordId: recordId,
      price: data.price,
      comment: data.comment,
      status: selectedStatus,
      time: selectedTime,
      date: selectedDate,
      userId: currentUser?.id,
      masterId: selectedMasterId,
      cameFrom: data.cameFrom,
    })
    if (result === "Success") {
      successNotify()
    } else {
      errorNotify()
    }

    records[records.findIndex((record) => record.id === recordId)].status =
      selectedStatus
    reset(Math.random())
  }

  return (
    <div className="text-brown">
      <h3 className="mb-[4px] flex justify-between">
        #{record?.id}
        <button
          className="border border-lightBrown rounded-lg text-sm p-[2px]"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory
            ? dictionary[selectedLanguage].info
            : dictionary[selectedLanguage].history}
        </button>
        <button onClick={() => handleClose(null)}>
          <img
            className="cursor-pointer w-[20px] h-[20px]"
            src={Close}
            alt=""
          />
        </button>
      </h3>

      {showHistory ? (
        <div className="overflow-y-scroll max-h-[800px] w-full">
          {historyList}
        </div>
      ) : (
        <>
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
                  {!client?.communication ? (
                    <img className="w-[18px] h-[18px]" src={Mute} alt="mute" />
                  ) : null}
                </div>
              </Link>
              {currentUser?.isAdmin ? (
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
          {!client?.cameFrom && selectedStatus === "completed" ? (
            <>
              <label className="text-lightBrown" htmlFor="cameFrom">
                {dictionary[selectedLanguage].cameFrom}
              </label>
              <TextField
                name={"cameFrom"}
                type={"text"}
                onChange={handleChange}
              ></TextField>
            </>
          ) : null}

          <p className="font-thin mb-[4px]">
            {dictionary[selectedLanguage].master}
          </p>

          {currentUser?.isAdmin ? (
            <div className="flex justify-between items-center px-[8px] py-[7px] mb-[8px] border border-lightBrown text-lightBrown rounded-lg cursor-pointer relative">
              <div
                className={"w-full flex justify-between items-center"}
                onClick={() =>
                  record?.status === "created"
                    ? setShowMaster(!showMaster)
                    : null
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
                  (user) => user.id === record.userId
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
            disabled={
              (!data.price || (!data.cameFrom && !client?.cameFrom)) &&
              selectedStatus === "completed"
                ? true
                : false
            }
          >
            {dictionary[selectedLanguage].confirm}
          </button>
        </>
      )}
    </div>
  )
}

DetailedRecordInfo.propTypes = {
  recordId: PropTypes.number,
  handleClose: PropTypes.func,
  setUpdatedRecords: PropTypes.func,
  currentUser: PropTypes.object,
  successNotify: PropTypes.func,
  errorNotify: PropTypes.func,
}

export default DetailedRecordInfo
