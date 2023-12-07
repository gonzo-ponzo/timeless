import React from "react"
import PropTypes from "prop-types"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientPageRecordElement = ({ record, lastEl, services, users }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const recordServices = services
    ? services.filter((service) => record.services.includes(Number(service.id)))
    : []
  let recordServicesMaster = ""
  for (let i = 0; i < record.users.length; i++) {
    const user = users?.find((user) => user.id === record.users[i])
    recordServicesMaster =
      recordServicesMaster +
      `${user.name}${i === record.users.length - 1 ? "" : "/"}`
  }

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
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
          {recordServicesMaster}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px]">{`${record.id}`}</div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
          {recordServicesName}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-3">
          {recordServicesPrice}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
          {record.time.slice(0, 5)}
        </div>
        <div className="flex items-center justify-start py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:items-start">
          {record.image ? (
            <a href={record.image} target="_blank">
              {dictionary[selectedLanguage].photo}
            </a>
          ) : null}
        </div>
      </div>
    </>
  )
}

ClientPageRecordElement.propTypes = {
  record: PropTypes.object.isRequired,
  lastEl: PropTypes.bool,
  services: PropTypes.array,
  users: PropTypes.array,
}

export default ClientPageRecordElement
