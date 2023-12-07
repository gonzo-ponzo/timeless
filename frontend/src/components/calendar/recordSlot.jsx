import PropTypes from "prop-types";

const RecordSlot = (record, date) => {
  return record.type ? (
    <div
      className={`absolute flex justify-center left-[3px] w-[calc(100%-6px)] items-center rounded-lg p-[3px] bg-${
        record.type
      }  border text-${
        "dark" + record.type.charAt(0).toUpperCase() + record.type.slice(1)
      }  border-${
        "dark" + record.type.charAt(0).toUpperCase() + record.type.slice(1)
      } text-xs text-center`}
      style={{
        top: `${record.start + 2 - 480}px`,
        height: `${record.duration - 4}px`,
      }}
      key={date + record.start}
    >
      {record.type === "blue"
        ? `${Math.floor(record.start / 60)}:${
            record.start - Math.floor(record.start / 60) * 60 > 9
              ? record.start - Math.floor(record.start / 60) * 60
              : `0${record.start - Math.floor(record.start / 60) * 60}`
          }`
        : `Забронировано`}
    </div>
  ) : null;
};

RecordSlot.propTypes = {
  record: PropTypes.object,
  date: PropTypes.string,
};

export default RecordSlot;
