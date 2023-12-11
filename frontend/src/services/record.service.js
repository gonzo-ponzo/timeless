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
  getAvailableCrmRecords: (
    selectedServiceId,
    userId,
    selectedUserId,
    boardDayDate
  ) => {
    const { data } = httpRecord.get(
      `get-available-crm/${selectedServiceId}/${userId}/${selectedUserId}/${boardDayDate}`
    )
    return data
  },
  UpdateRecord: async (data) => {
    const { updatedRecord } = await httpRecord.patch(
      "/record/" + data.recordId,
      data
    )
    return updatedRecord
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
  UploadRecordImage: async (recordId, data) => {
    await httpRecord.patch("image/" + recordId, data)
  },
}

export default recordService
