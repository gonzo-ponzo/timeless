import React from "react"
import PropTypes from "prop-types"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientPageRecordElement = ({ record, lastEl }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

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
          {record?.user?.name}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px]">{`${record.id}`}</div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-2">
          {record?.service[selectedLanguage]}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[6px] max-md:col-span-3 max-md:text-center">
          {record?.service?.price}
          {record.status === "completed" ? (
            <div>
              <b>{record?.price}</b>
            </div>
          ) : null}
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
}

export default ClientPageRecordElement
