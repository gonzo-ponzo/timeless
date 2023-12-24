import PropTypes from "prop-types"
import _ from "lodash"
import TimeGraph from "./timeGraph"
import ClientCalendarBoardDay from "./clientCalendarBoardDay"

const CalendarBoard = ({
  firstDay,
  selectedService,
  selectedUser,
  selectedSlot,
  handleSelectedSlot,
}) => {
  const daysCount = window.innerWidth <= 767 ? 1 : 4
  const calendarBoardDays = _.range(daysCount).map((day) => (
    <ClientCalendarBoardDay
      date={new Date(firstDay.getTime() + 1000 * 60 * 60 * 24 * day)}
      selectedService={selectedService}
      selectedUser={selectedUser}
      selectedSlot={selectedSlot}
      onSlotSelect={handleSelectedSlot}
      key={day}
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
  selectedService: PropTypes.object,
  selectedUser: PropTypes.object,
  selectedSlot: PropTypes.object,
  handleSelectedSlot: PropTypes.func,
}

export default CalendarBoard
