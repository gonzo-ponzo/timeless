import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import MastersList from "../components/master/mastersList"
import userService from "../services/user.service"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"

const MastersPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [users, setUsers] = useState([])
  const loadData = async () => {
    const allUsers = await userService.getUsers()
    setUsers(allUsers.filter((user) => user.isStaff))
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream  max-md:text-xs">
      <ContainerBox>
        <h2 className="text-brown text-2xl max-md:text-lg">
          {dictionary[selectedLanguage].masters}
        </h2>
        <MastersList users={users}></MastersList>
      </ContainerBox>
    </div>
  )
}

export default MastersPage
