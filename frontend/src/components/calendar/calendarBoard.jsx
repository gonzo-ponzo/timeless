import PropTypes from "prop-types"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import ClientCalendarBoardDay from "./clientCalendarBoardDay"

const CalendarBoard = ({
  firstDay,
  records,
  services,
  selectedService,
  selectedUser,
  selectedSlot,
  handleSelectedSlot,
}) => {
  const daysCount = window.innerWidth <= 767 ? 1 : 4
  const calendarBoardDays = _.range(daysCount).map((day) => (
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
  ))

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
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  handleSelectedSlot: PropTypes.func,
}

export default CalendarBoard
