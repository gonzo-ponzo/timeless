import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import ClientPageCommentElement from "./clientPageCommentElement"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"
import commentService from "../../services/comment.service"

const ClientPageComments = ({ clientId }) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [comments, setComments] = useState(null)

  const loadData = async (clientId) => {
    setComments(await commentService.getCommentsByClientId(clientId))
  }
  useEffect(() => {
    if (clientId) {
      loadData(clientId)
    }
  }, [clientId])
  const commentsElements = comments
    ? comments.map((comment) => (
        <ClientPageCommentElement
          comment={comment}
          key={comment.createdAt}
        ></ClientPageCommentElement>
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

ClientPageComments.propTypes = {
  clientId: PropTypes.object.isRequired,
}

export default ClientPageComments
