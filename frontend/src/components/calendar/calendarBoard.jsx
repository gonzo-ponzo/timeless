import PropTypes from "prop-types"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import ClientCalendarBoardDay from "./clientCalendarBoardDay"
import CrmCalendarBoardDay from "./crmCalendarBoardDay"

const CalendarBoard = ({
  firstDay,
  records,
  services,
  clients,
  selectedService,
  selectedUser,
  selectedSlot,
  handleSelectedSlot,
  handleSetDate,
  pageType,
  setSlotForChange,
}) => {
  const daysCount = window.innerWidth <= 767 ? 1 : 4
  const calendarBoardDays = _.range(daysCount).map((day) =>
    pageType === "client" ? (
      <ClientCalendarBoardDay
        date={new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)}
        records={records}
        services={services}
        selectedService={selectedService}
        selectedUser={selectedUser}
        key={day}
        selectedSlot={selectedSlot}
        onSlotSelect={handleSelectedSlot}
      />
    ) : (
      <CrmCalendarBoardDay
        date={new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)}
        clients={clients}
        selectedService={selectedService ? selectedService : 1}
        selectedUser={selectedUser}
        key={day}
        selectedSlot={selectedSlot}
        onSlotSelect={handleSelectedSlot}
        setSlotForChange={setSlotForChange}
      />
    )
  )

  return (
    <>
      <TimeGraph></TimeGraph>
      <div className="md:grid md:grid-cols-4 w-full relative">
        {calendarBoardDays}
      </div>
    </>
  )
}

CalendarBoard.propTypes = {
  date: PropTypes.instanceOf(Date),
  records: PropTypes.array,
  services: PropTypes.array,
  clients: PropTypes.array,
  users: PropTypes.array,
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  handleSelectedSlot: PropTypes.func,
  handleSetDate: PropTypes.func,
  setSlotForChange: PropTypes.func,
  pageType: PropTypes.string,
}

export default CalendarBoard
