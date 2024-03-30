import axios from "axios"
import apiEnpoint from "./config"

const httpRecord = axios.create({
  baseURL: `${apiEnpoint}api/records/`,
})

const recordService = {
  getRecords: async () => {
    const { data } = await httpRecord.get("")
    return data
  },
  getRecordsByDate: async (date) => {
    const { data } = await httpRecord.get(`by-date/${date}`)
    return data
  },
  deleteBreak: async (recordId) => {
    const { data } = await httpRecord.get(`delete-break/${recordId}`)
    return data
  },
  getAvailableRecords: async (
    selectedServiceId,
    selectedUserId,
    boardDayDate
  ) => {
    const { data } = await httpRecord.get(
      `get-available/${selectedServiceId}/${selectedUserId}/${boardDayDate}`
    )
    return data
  },
  getAvailableCrmRecords: (userId, selectedUserId, boardDayDate) => {
    const { data } = httpRecord.get(
      `get-available-crm/${userId}/${selectedUserId}/${boardDayDate}`
    )
    return data
  },
  UpdateRecord: async (payload) => {
    const { data } = await httpRecord.patch(
      "/record/" + payload.recordId,
      payload
    )
    return data
  },
  CancelRecord: async ({ recordId }) => {
    await httpRecord.post("cancel", { recordId })
    return
  },
  createNewRecord: async (recordData) => {
    const { data } = await httpRecord.post("", recordData)
    return data
  },
  createNewRecordWithRegister: async (recordData) => {
    const { data } = await httpRecord.post("register-and-record", recordData)
    return data
  },
  createNewComplex: async (recordData) => {
    const { data } = await httpRecord.post("complex", recordData)
    return data
  },
  createNewComplexWithRegister: async (recordData) => {
    const { data } = await httpRecord.post("complex-with-register", recordData)
    return data
  },
  UploadRecordImage: async (recordId, data) => {
    await httpRecord.patch("image/" + recordId, data)
  },
}

export default recordService
