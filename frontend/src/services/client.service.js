import axios from "axios"
import apiEnpoint from "./config"

const httpClient = axios.create({
  baseURL: `${apiEnpoint}api/clients/`,
})

const clientService = {
  getClients: async () => {
    const { data } = await httpClient.get("")
    return data
  },
  getClientById: async (clientId) => {
    const { data } = await httpClient.get("client/" + clientId)
    return data
  },
  getClientByPhone: async (clientPhone) => {
    const { data } = await httpClient.get("client/phone/" + clientPhone)
    return data
  },
  getClientByTelegram: async (clientTelegram) => {
    const { data } = await httpClient.get("client/telegram/" + clientTelegram)
    return data
  },
  getClientByInstagram: async (clientInstagram) => {
    const { data } = await httpClient.get("client/instagram/" + clientInstagram)
    return data
  },
  getCurrentClient: async (clientId) => {
    const currentClient = await httpClient.get("/client/" + clientId)
    return currentClient.data
  },
  UpdateCurrentClient: async (data) => {
    const { updatedClient } = await httpClient.patch(
      "/client/" + data.clientId,
      data
    )
    return updatedClient
  },
  UpdateClientImage: async (data) => {
    const { image } = await httpClient.patch("image/", data.formData)
    return URL.createObjectURL(image)
  },
  UploadClientImage: async (clientId, data) => {
    await httpClient.patch("image/" + clientId, data)
  },
}

export default clientService
