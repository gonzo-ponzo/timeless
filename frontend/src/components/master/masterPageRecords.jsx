import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import MasterPageRecordElement from "./masterPageRecordElement"
import clientService from "../../services/client.service"
import recordService from "../../services/record.service"
import serviceService from "../../services/service.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const MasterPageRecords = ({ userId, date }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [clients, setClients] = useState(null)
  const [records, setRecords] = useState(null)
  const [services, setServices] = useState(null)

  const loadData = async () => {
    setClients(await clientService.getClients())
    setRecords(await recordService.getRecords())
    setServices(await serviceService.getServices())
  }

  useEffect(() => {
    loadData()
  }, [])

  const userRecords = records
    ? records
        .filter((record) => record.users.includes(userId))
        .filter((record) => record.date === date)
    : null

  const recordsElements =
    userRecords && userRecords.length > 0
      ? userRecords.map((record) => (
          <MasterPageRecordElement
            record={record}
            lastEl={userRecords[userRecords.length - 1] === record}
            services={services}
            clients={clients}
            key={record.id}
          ></MasterPageRecordElement>
        ))
      : dictionary[selectedLanguage].noData

  return userRecords ? (
    <>
      <h2 className="text-brown text-2xl mt-[32px] max-md:text-lg max-md:mt-[5px]">
        {dictionary[selectedLanguage].recordHistory}
      </h2>
      <div className="text-darkBrown pt-[32px] max-md:pt-[5px] max-md:text-xs">
        <div className="grid grid-cols-6 bg-lightGray border border-gray rounded-t-lg font-bold max-md:grid-cols-12">
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].client}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px]">
            #
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-3">
            {dictionary[selectedLanguage].service}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].price}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].time}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].photo}
          </div>
        </div>
        {recordsElements}
      </div>
    </>
  ) : null
}

MasterPageRecords.propTypes = {
  userId: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
}

export default MasterPageRecords
