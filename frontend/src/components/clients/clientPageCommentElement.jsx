import PropTypes from "prop-types"
import starFull from "../../assets/imgs/Star 6.png"
import _ from "lodash"
import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"

const ClientPageCommentElement = ({ comment }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <>
      <div className="border flex flex-col border-gray rounded-lg w-full text-brown px-[16px] py-[12px] mb-[16px]">
        <p className="mb-[16px] text-darkBrown">{`Номер - №${comment.recordId}`}</p>
        <div className="flex">
          {comment.authorImage ? (
            <img
              className="mr-[6px] w-[50px] h-[50px] rounded-full"
              src={comment.authorImage}
              alt=""
            />
          ) : null}
          <div>
            <p className="text-darkBrown mb-[6px]">
              {comment.authorName
                ? comment.authorName
                : dictionary[selectedLanguage].noData}
              {comment.authorType === "user"
                ? ` (${dictionary[selectedLanguage].staff})`
                : ` (${dictionary[selectedLanguage].client})`}
            </p>
            <p className="mb-[16px]">{comment.content}</p>
          </div>
        </div>
        {comment.image ? (
          <a href={comment.image} target="_blank">
            {dictionary[selectedLanguage].photo}
          </a>
        ) : null}
        <div className="flex justify-end items-center ">
          {_.range(Number(comment.rating)).map((x) => (
            <img className="w-[20px] h-[20px] mb-[3px]" src={starFull} alt="" />
          ))}
          <p className="text-xs ml-[16px]">{comment.createdAt}</p>
        </div>
      </div>
    </>
  )
}

ClientPageCommentElement.propTypes = {
  comment: PropTypes.object,
}
export default ClientPageCommentElement
