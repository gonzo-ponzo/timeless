import React, { useState } from "react"
import TextField from "../components/textField"
import commentService from "../services/comment.service"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"

const FeedbackPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const [data, setData] = useState({
    name: "",
    email: "",
    content: "",
  })
  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = async () => {
    await commentService.createFeedback(data.name, data.email, data.content)
  }
  const windowWidth = window.innerWidth

  return (
    <div className="container-fluid relative mx-auto h-screen flex justify-center items-start bg-cream text-brown">
      {windowWidth > 400 ? (
        <div className="grid grid-cols-2 w-full mx-auto max-w-[1496px]">
          <div className="p-[20px] h-screen">
            <iframe
              title={"googleMaps"}
              src="http://maps.google.com/maps?q=45.25878370498284, 19.81603151844797&z=14&output=embed"
              className="w-full h-[calc(50%)] rounded-2xl mb-[20px]"
            ></iframe>
            <p className="mb-[20px]">
              Илије Бирчанина 29, Нови Сад, Новис Сад 21000, Serbia
            </p>
            <a className="hover:opacity-80" href="tel:+381693005555">
              +381693005555
            </a>
          </div>
          <div className="p-[20px]">
            <TextField
              name="name"
              label="Имя"
              placeholder={dictionary[selectedLanguage].yourName}
              type="text"
              onChange={handleChange}
            ></TextField>
            <TextField
              name="email"
              label="E-mail"
              placeholder="E-mail"
              type="email"
              onChange={handleChange}
            ></TextField>
            <TextField
              name="content"
              label={dictionary[selectedLanguage].message}
              placeholder=""
              type="text"
              onChange={handleChange}
              area={true}
            ></TextField>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-brown rounded-lg text-white text-center w-[50%] py-[8px] mt-[24px] hover:opacity-80"
              >
                {dictionary[selectedLanguage].confirm}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto max-w-[1496px]">
          <div className="p-[20px] max-md:p-[5px]">
            <TextField
              name="name"
              label={dictionary[selectedLanguage].yourName}
              placeholder={dictionary[selectedLanguage].yourName}
              type="text"
              onChange={handleChange}
            ></TextField>
            <TextField
              name="email"
              label="E-mail"
              placeholder="E-mail"
              type="email"
              onChange={handleChange}
            ></TextField>
            <TextField
              name="content"
              label={dictionary[selectedLanguage].message}
              placeholder=""
              type="text"
              onChange={handleChange}
              area={true}
            ></TextField>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-brown rounded-lg text-white text-center w-[50%] py-[8px] mt-[24px] hover:opacity-80"
              >
                {dictionary[selectedLanguage].confirm}
              </button>
            </div>
          </div>

          <div className="p-[20px] h-full">
            <iframe
              title={"googleMaps"}
              src="http://maps.google.com/maps?q=45.25878370498284, 19.81603151844797&z=14&output=embed"
              className="w-full h-[calc(50%)] rounded-2xl mb-[20px] max-md:h-[320px]"
            ></iframe>
            <p className="mb-[20px]">
              Илије Бирчанина 29, Нови Сад, Новис Сад 21000, Serbia
            </p>
            <a className="hover:opacity-80" href="tel:+381693005555">
              +381693005555
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackPage
