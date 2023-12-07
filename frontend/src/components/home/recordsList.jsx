import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import ClientRecordElement from "./clientRecordElement"
import CrmRecordElement from "./CrmRecordElement"
import clientService from "../../services/client.service"
import serviceService from "../../services/service.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const RecordsList = ({ filteredRecords, pageType }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [clients, setClients] = useState(null)
  const [services, setServices] = useState(null)
  const loadData = async () => {
    setClients(await clientService.getClients())
    setServices(await serviceService.getServices())
  }

  useEffect(() => {
    loadData()
  }, [])

  const recordsElements =
    pageType === "client"
      ? filteredRecords && filteredRecords.length > 0
        ? filteredRecords.map((record) => (
            <ClientRecordElement
              record={record}
              services={services}
              lastEl={filteredRecords[filteredRecords.length - 1] === record}
              key={record.id}
            ></ClientRecordElement>
          ))
        : null
      : filteredRecords && filteredRecords.length > 0
      ? filteredRecords.map((record) => (
          <CrmRecordElement
            record={record}
            lastEl={filteredRecords[filteredRecords.length - 1] === record}
            services={services}
            clients={clients}
            records={filteredRecords}
            key={record.id}
          ></CrmRecordElement>
        ))
      : null
  return recordsElements ? (
    pageType === "client" ? (
      <div className="text-darkBrown pt-[32px] max-md:text-xs">
        <div className="grid grid-cols-4 bg-lightGray border border-gray rounded-t-lg font-bold">
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].name}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].service}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].price}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].time}
          </div>
        </div>
        {recordsElements}
      </div>
    ) : (
      <div className="text-darkBrown pt-[32px] max-md:text-xs">
        <div className="grid grid-cols-5 bg-lightGray border border-gray rounded-t-lg font-bold">
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].name}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].service}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].price}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].time}
          </div>
          <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px]">
            {dictionary[selectedLanguage].status}
          </div>
        </div>
        {recordsElements}
      </div>
    )
  ) : (
    <div className="text-darkBrown pt-[32px]">
      {dictionary[selectedLanguage].noData}
    </div>
  )
}

RecordsList.propTypes = {
  filteredRecords: PropTypes.array,
  pageType: PropTypes.string.isRequired,
}

export default RecordsList
