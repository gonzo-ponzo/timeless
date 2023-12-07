import React from "react"
import PropTypes from "prop-types"
import ClientElement from "./clientElement"
import localStorageService from "../../services/localStorage.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientsList = ({ clients, records, comments }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const userId = localStorageService.getUserId()
  const userRecords = records?.filter((record) =>
    record.users.includes(Number(userId))
  )
  const userClientsIndex = userRecords?.map((record) => record.clientId)
  const userClients = clients.filter((client) =>
    userClientsIndex.includes(client.id)
  )
  const clientElements = userClients
    ? userClients.map((client) => (
        <ClientElement
          key={client.id}
          client={client}
          comments={comments}
          records={userRecords}
          lastEl={client === userClients[userClients.length - 1]}
        ></ClientElement>
      ))
    : null
  return (
    <div className="text-darkBrown pt-[32px]">
      <div className="grid grid-cols-3 bg-lightGray border border-gray rounded-t-lg  font-bold max-md:grid-cols-5">
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px] max-md:col-span-2">
          {dictionary[selectedLanguage].userName}
        </div>
        <div className="py-[12px] px-[20px max-md:py-[6px] max-md:px-[10px]]">
          {dictionary[selectedLanguage].rating}
        </div>
        <div className="py-[12px] px-[20px] max-md:py-[6px] max-md:px-[10px] max-md:col-span-2">
          {dictionary[selectedLanguage].feedbackClient}
        </div>
      </div>
      {clientElements}
    </div>
  )
}

ClientsList.propTypes = {
  clients: PropTypes.array,
  records: PropTypes.array,
  comments: PropTypes.array,
}

export default ClientsList
