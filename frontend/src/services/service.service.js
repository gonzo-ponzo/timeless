import axios from "axios"
import apiEnpoint from "./config"

const httpService = axios.create({
  baseURL: `${apiEnpoint}api/services/`,
})

const serviceService = {
  getServices: async () => {
    const { data } = await httpService.get("")
    return data
  },

  getComplexes: async () => {
    const { data } = await httpService.get("complexes")
    return data
  },
}

export default serviceService
