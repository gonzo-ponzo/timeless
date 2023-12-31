export default function fillDayWithAvailableSlots(
  selectedService,
  existingRecords,
  boardDayDate,
  selectedSlots,
  userId
) {
  const existingRecordsWithSlots = []

  existingRecords?.forEach((record) => {
    existingRecordsWithSlots.push(record)
  })
  if (selectedSlots) {
    selectedSlots.forEach((slot) => {
      if (slot?.date === boardDayDate && slot.userId === userId) {
        slot.type = "pink"
        existingRecordsWithSlots.push(slot)
      }
    })
  }

  for (
    let start = 540;
    start + selectedService?.duration <= 1320;
    start += 10
  ) {
    let conflict = false
    existingRecordsWithSlots.forEach((record) => {
      if (
        record.start <= start &&
        start < record.end &&
        record.type !== "green"
      ) {
        conflict = true
      } else if (
        record.start < start + selectedService?.duration &&
        start + selectedService?.duration < record.end &&
        record.type !== "green"
      ) {
        conflict = true
      } else if (
        start < record.start &&
        record.start < start + selectedService?.duration &&
        record.type !== "green"
      ) {
        conflict = true
      } else if (conflict === false && start % 30 > 0) {
        conflict = true
      }
    })
    if (!conflict) {
      existingRecordsWithSlots.push({
        start: start,
        end: start + selectedService?.duration,
        duration: selectedService?.duration,
        type: "green",
        date: boardDayDate,
        top: start - 480,
      })
    }
  }

  return existingRecordsWithSlots
}
