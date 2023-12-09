import PropTypes from "prop-types"
import Canceled from "../../assets/imgs/canceled.svg"
import Completed from "../../assets/imgs/completed.svg"
import Created from "../../assets/imgs/created.svg"

const StatusButton = ({ type, handleSelectStatus, selectedStatus }) => {
  let image
  switch (type) {
    case "completed":
      image = <img src={Completed} alt="" />
      break
    case "canceled":
      image = <img src={Canceled} alt="" />
      break
    case "created":
      image = <img src={Created} alt="" />
      break
    default:
      break
  }

  return (
    <span
      className={`w-[25px] h-[25px]  p-[2px] opacity-${
        selectedStatus === type ? "100" : "50"
      } hover:opacity-100 mr-[10px]`}
      onClick={() => handleSelectStatus(type)}
    >
      {image}
    </span>
  )
}

StatusButton.propTypes = {
  type: PropTypes.string,
  handleSelectStatus: PropTypes.func,
  selectedStatus: PropTypes.string,
}

export default StatusButton
