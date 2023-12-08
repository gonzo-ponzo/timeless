import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import ClientPageRecordElement from "./clientPageRecordElement"
import userService from "../../services/user.service"
import recordService from "../../services/record.service"
import serviceService from "../../services/service.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientPageRecords = ({ clientId, date }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [users, setUsers] = useState(null)
  const [records, setRecords] = useState(null)
  const [services, setServices] = useState(null)
  const loadData = async () => {
    setUsers(await userService.getUsers())
    setServices(await serviceService.getServices())
    setRecords(await recordService.getRecords())
  }

  useEffect(() => {
    loadData()
  }, [])

  const clientRecords = records
    ? records
        .filter((record) => record.clientId === clientId)
        .filter((record) => record.date === date)
    : null

  const recordsElements =
    clientRecords && clientRecords.length > 0
      ? clientRecords.map((record) => (
          <ClientPageRecordElement
            record={record}
            lastEl={clientRecords[clientRecords.length - 1] === record}
            services={services}
            users={users}
            key={record.id}
          ></ClientPageRecordElement>
        ))
      : null

  return clientRecords ? (
    <>
      <h2 className="text-brown text-2xl mt-[32px] max-md:text-lg max-md:mt-[5px]">
        {dictionary[selectedLanguage].recordHistory}
      </h2>
      <div className="text-darkBrown pt-[32px] max-md:text-xs">
        <div className="grid grid-cols-6 bg-lightGray border border-gray rounded-t-lg font-bold max-md:grid-cols-12">
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].master}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px]">
            #
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].service}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-3 max-md:text-center">
            {dictionary[selectedLanguage].price}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
            {dictionary[selectedLanguage].time}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px]">
            {dictionary[selectedLanguage].photo}
          </div>
        </div>
        {recordsElements}
      </div>
    </>
  ) : null
}

ClientPageRecords.propTypes = {
  clientId: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
}

export default ClientPageRecords
