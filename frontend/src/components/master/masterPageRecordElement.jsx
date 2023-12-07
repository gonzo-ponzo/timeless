import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import clientService from "../../services/client.service"
import dictionary from "../../utils/dictionary"

const MasterPageRecordElement = ({ record, lastEl, services, clients }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const recordServices = services
    ? services.filter((service) => record.services.includes(Number(service.id)))
    : []
  const [client, setClient] = useState()
  const loadData = async (clientId) => {
    setClient(await clientService.getClientById(clientId))
  }
  useEffect(() => {
    loadData(record.clientId)
  }, [record])

  let recordServicesName = ""
  let recordServicesPrice = 0
  for (let i = 0; i < recordServices.length; i++) {
    recordServicesPrice = recordServicesPrice + recordServices[i].price
    recordServicesName =
      recordServicesName +
      `${recordServices[i].name}${i === recordServices.length - 1 ? "" : "/"}`
  }

  return (
    <>
      <div
        className={
          lastEl
            ? "grid grid-cols-6 border border-gray rounded-b-lg max-md:grid-cols-12"
            : "grid grid-cols-6 border border-gray max-md:grid-cols-12"
        }
      >
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:text-start max-md:col-span-2">
          {client?.name}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:text-start">{`${record.id}`}</div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:text-start max-md:col-span-3">
          {recordServicesName}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:text-start max-md:col-span-2">
          {recordServicesPrice}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:text-start max-md:col-span-2">
          {record.time.slice(0, 5)}
        </div>
        <div className="py-[12px] px-[20px] flex items-center justify-start max-md:py-[6px] max-md:px-[6px] max-md:text-start max-md:col-span-2 max-md:items-start">
          <a href={record.image}>{dictionary[selectedLanguage].photo}</a>
        </div>
      </div>
    </>
  )
}

MasterPageRecordElement.propTypes = {
  record: PropTypes.object.isRequired,
  lastEl: PropTypes.bool,
  services: PropTypes.array,
  users: PropTypes.array,
}

export default MasterPageRecordElement
