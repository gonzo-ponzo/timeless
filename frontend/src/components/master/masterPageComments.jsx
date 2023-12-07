import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import MasterPageCommentElement from "./masterPageCommentElement"
import commentService from "../../services/comment.service"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const MasterPageComments = ({ userId }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [comments, setComments] = useState(null)
  const loadData = async (userId) => {
    setComments(await commentService.getCommentsByUserId(userId))
  }
  useEffect(() => {
    if (userId) {
      loadData(userId)
    }
  }, [userId])

  const commentsElements = comments
    ? comments.map((comment) => (
        <MasterPageCommentElement
          comment={comment}
          key={comment.id + comment.authorId}
        ></MasterPageCommentElement>
      ))
    : null

  return commentsElements ? (
    <>
      <h2 className="text-brown text-2xl mt-[32px]">
        {dictionary[selectedLanguage].commentsList}
      </h2>

      {commentsElements}
    </>
  ) : (
    <p>{dictionary[selectedLanguage].noData}</p>
  )
}

MasterPageComments.propTypes = {
  userId: PropTypes.object.isRequired,
}

export default MasterPageComments
