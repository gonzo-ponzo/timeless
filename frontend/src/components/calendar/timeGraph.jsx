const TimeGraph = () => {
  let currentDate = new Date()
  let currentHour = currentDate.getHours()
  return (
    <>
      <div className="flex flex-col text-sm text-center">
        <div className="h-[60px] w-[55px]"></div>
        <div
          className={`flex h-[60px] w-[55px] justify-center items-center border-b  border-t border-gray ${
            currentHour === 9 ? "border-b-red border-t-red" : null
          } ${currentHour === 10 ? "border-b-red" : null}`}
        >
          09:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 10 || currentHour === 11 ? "border-b-red" : null
          }`}
        >
          10:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 11 || currentHour === 12 ? "border-b-red" : null
          }`}
        >
          11:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 12 || currentHour === 13 ? "border-b-red" : null
          }`}
        >
          12:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 13 || currentHour === 14 ? "border-b-red" : null
          }`}
        >
          13:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 14 || currentHour === 15 ? "border-b-red" : null
          }`}
        >
          14:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 15 || currentHour === 16 ? "border-b-red" : null
          }`}
        >
          15:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 16 || currentHour === 17 ? "border-b-red" : null
          }`}
        >
          16:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 17 || currentHour === 18 ? "border-b-red" : null
          }`}
        >
          17:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 18 || currentHour === 19 ? "border-b-red" : null
          }`}
        >
          18:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 19 || currentHour === 20 ? "border-b-red" : null
          }`}
        >
          19:00
        </div>
        <div
          className={`flex h-[60px] w-[55px] relative justify-center items-center border-b border-gray ${
            currentHour === 20 || currentHour === 21 ? "border-b-red" : null
          }`}
        >
          20:00
        </div>
        <div className="flex h-[60px] w-[55px] relative justify-center items-center">
          21:00
        </div>
      </div>
    </>
  )
}

export default TimeGraph
