import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css"
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker"
import dictionary from "../../utils/dictionary"

export default function Calendar({ date, handleSelectDate }) {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [selectedDay, setSelectedDay] = useState({
    day: date.getDay(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  })
  useEffect(() => {
    setSelectedDay({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    })
  }, [date])

  const options = { month: "long", day: "numeric", year: "numeric" }
  const months = dictionary[selectedLanguage].firstMonth
  const myCustomLocale = {
    months: dictionary[selectedLanguage].secondMonth,

    weekDays: [
      {
        name: "Понедельник",
        short: dictionary[selectedLanguage].shortDays[0],
        isWeekend: true,
      },
      {
        name: "Вторник",
        short: dictionary[selectedLanguage].shortDays[1],
      },
      {
        name: "Среда",
        short: dictionary[selectedLanguage].shortDays[2],
      },
      {
        name: "Четверг",
        short: dictionary[selectedLanguage].shortDays[3],
      },
      {
        name: "Пятница",
        short: dictionary[selectedLanguage].shortDays[4],
      },
      {
        name: "Суббота",
        short: dictionary[selectedLanguage].shortDays[5],
      },
      {
        name: "Воскресенье",
        short: dictionary[selectedLanguage].shortDays[6],
        isWeekend: true,
      },
    ],

    weekStartingIndex: 0,

    getToday(gregorainTodayObject) {
      return gregorainTodayObject
    },

    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day)
    },

    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate()
    },

    transformDigit(digit) {
      return digit
    },

    nextMonth: "Следующий",
    previousMonth: "Прошлый",
    openMonthSelector: "Выбрать месяц",
    openYearSelector: "Выбрать год",
    closeMonthSelector: "Закрыть",
    closeYearSelector: "Закрыть",
    defaultPlaceholder: "Выбрать",

    // for input range value
    from: "from",
    to: "to",

    digitSeparator: ".",

    yearLetterSkip: 0,

    isRtl: false,
  }

  const renderCustomInput = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      value={
        selectedDay
          ? `${selectedDay.day} ${months[selectedDay.month - 1]} ${
              selectedDay.year
            }`
          : date.toLocaleString(
              dictionary[selectedLanguage].calendarLanguage,
              options
            )
      }
      style={{
        fontSize: "16px",
        color: "rgba(158, 117, 49, 0.7)",
        outline: "none",
        cursor: "pointer",
        textDecoration: "underline",
        textAlign: "center",
      }}
    />
  )
  return (
    <DatePicker
      value={selectedDay}
      onChange={handleSelectDate}
      colorPrimary="#9E7531"
      colorPrimaryLight="#9E7531"
      renderInput={renderCustomInput}
      shouldHighlightWeekends
      locale={myCustomLocale}
      style={{
        width: "100%",
      }}
    />
  )
}
