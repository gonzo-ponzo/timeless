import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import ClientsList from "../components/clients/clientsList"
import { useNavigate } from "react-router-dom"
import localStorageService from "../services/localStorage.service"
import clientService from "../services/client.service"
import commentService from "../services/comment.service"
import recordService from "../services/record.service"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"
import userService from "../services/user.service"

const ClientsPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  const navigate = useNavigate()
  const userId = localStorageService.getUserId()
  if (!userId) {
    navigate("/crm/login")
  }
  const [clients, setClients] = useState([])
  const [user, setUser] = useState()
  const [comments, setComments] = useState([])
  const [records, setRecords] = useState([])
  const loadData = async (userId) => {
    setClients(await clientService.getClients())
    setComments(await commentService.getComments())
    setRecords(await recordService.getRecords())
    setUser(await userService.getUserById(userId))
  }
  useEffect(() => {
    loadData(userId)
  }, [userId])
  if (user) {
    if (user.isStaff || user.isAdmin) {
      return (
        <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream max-md:text-sm">
          <ContainerBox>
            <h2 className="text-brown text-2xl max-md:text-lg">
              {dictionary[selectedLanguage].feedbacks}
            </h2>
            <ClientsList
              clients={clients}
              records={records}
              comments={comments}
            ></ClientsList>
          </ContainerBox>
        </div>
      )
    } else {
      navigate("/crm/login")
    }
  }
}

export default ClientsPage
