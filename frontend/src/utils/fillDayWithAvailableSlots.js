export default function fillDayWithAvailableSlots(
  selectedService,
  existingRecords,
  boardDayDate
) {
  const existingRecordsWithSlots = []
  existingRecords?.forEach((record) => {
    existingRecordsWithSlots.push(record)
  })

  for (
    let start = 540;
    start + selectedService?.duration <= 1320;
    start += 10
  ) {
    let conflict = false
    existingRecords.forEach((record) => {
      if (record.start <= start && start < record.end) {
        conflict = true
      } else if (
        record.start < start + selectedService?.duration &&
        start + selectedService?.duration < record.end
      ) {
        conflict = true
      } else if (
        start < record.start &&
        record.start < start + selectedService?.duration
      ) {
        conflict = true
      }
    })
    if (!conflict) {
      existingRecords.push({
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
