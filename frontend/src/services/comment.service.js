import axios from "axios"
import apiEnpoint from "./config"

const httpComment = axios.create({
  baseURL: `${apiEnpoint}api/comments/`,
})

const commentService = {
  getComments: async () => {
    const { data } = await httpComment.get("")
    return data
  },
  getCommentsByUserId: async (userId) => {
    const { data } = await httpComment.get("comments-by-user/" + userId)
    return data
  },

  getCommentsByClientId: async (clientId) => {
    const { data } = await httpComment.get("comments-by-client/" + clientId)
    return data
  },

  createComment: async (clientId, userId, recordId, content, rating) => {
    return await httpComment.post("", {
      clientId,
      userId,
      recordId,
      content,
      rating,
    })
  },

  createFeedback: async (name, email, content) => {
    await httpComment.post("feedback", {
      name,
      email,
      content,
    })
  },
  UploadCommentImage: async (commentId, data) => {
    await httpComment.patch("image/" + commentId, data)
  },
}

export default commentService
