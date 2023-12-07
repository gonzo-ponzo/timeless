import axios from "axios"
import apiEnpoint from "./config"

const httpAuth = axios.create({
  baseURL: `${apiEnpoint}api/`,
})

const authService = {
  getClientAuthCode: async (phone) => {
    const { data } = await httpAuth.post("clients/auth-code", { phone })
    return data
  },

  createNewClient: async (phone, userId) => {
    await httpAuth.post("clients/register", { phone, userId })
  },

  clientLogin: async (phone, code) => {
    const { data } = await httpAuth.post("clients/login", { phone, code })
    return data
  },

  userLogin: async (phone, password) => {
    const { data } = await httpAuth.post("users/login", { phone, password })
    return data
  },
}

export default authService
