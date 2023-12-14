import axios from "axios"
import apiEnpoint from "./config"

const httpUser = axios.create({
  baseURL: `${apiEnpoint}api/users/`,
})

const userService = {
  getUserById: async (userId) => {
    const { data } = await httpUser.get("user/" + userId)
    return data
  },
  passwordRecovery: async (phone) => {
    await httpUser.post("password-recovery", { phone })
  },
  getUsers: async () => {
    const { data } = await httpUser.get("")
    return data
  },
  UpdateCurrentUser: async (data) => {
    const { updatedClient } = await httpUser.patch("/user/" + data.userId, data)
    return updatedClient
  },
  UploadUserImage: async (userId, data) => {
    await httpUser.patch("image/" + userId, data)
  },
}

export default userService
