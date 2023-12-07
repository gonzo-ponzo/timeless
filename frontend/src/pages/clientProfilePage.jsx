import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import TextField from "../components/textField"
import clientService from "../services/client.service"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import localStorageService from "../services/localStorage.service"
import { useNavigate } from "react-router-dom"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"

const ClientProfilePage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const navigate = useNavigate()
  const clientId = localStorageService.getClientId()
  if (!clientId) {
    navigate("/login")
  }
  const [client, setClient] = useState(null)
  const [selectedImage, setSelectedImage] = useState()
  const [selectedPreview, setSelectedPreview] = useState(client?.image)

  const loadData = async (clientId) => {
    setClient(await clientService.getClientById(clientId))
  }
  useEffect(() => {
    loadData(clientId)
  }, [clientId])

  useEffect(() => {
    setSelectedPreview(client?.image)
  }, [client])

  const [data, setData] = useState({
    name: client ? client.name : "",
    email: client ? client.email : "",
    telegram: client ? client.telegram : "",
    instagram: client ? client.instagram : "",
    birthday: client ? client.birthdate : null,
  })

  useEffect(() => {
    setData({
      name: client?.name,
      email: client?.email,
      telegram: client?.telegram,
      instagram: client?.instagram,
      birthday: client?.birthday,
    })
  }, [client])

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setSelectedPreview(url)
    setSelectedImage(file)
  }

  const handleSubmit = async () => {
    const clientId = client.id
    await clientService.UpdateCurrentClient({
      clientId,
      name: data.name,
      email: data.email,
      telegram: data.telegram,
      instagram: data.instagram,
      birthday: data.birthday,
    })
    if (selectedImage) {
      const formData = new FormData()
      formData.append("image", selectedImage)
      await clientService.UploadClientImage(clientId, formData)
    }
    notify()
  }

  return (
    <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream max-md:text-sm">
      <ContainerBox>
        <div className="flex justify-between">
          <div className="max-md:flex max-md:justify-between max-md:items-center max-md:w-full max-md:flex-row-reverse">
            <h2 className="text-darkBrown text-2xl max-md:text-lg max-md:mr-[6px]">
              {dictionary[selectedLanguage].yourProfile}
            </h2>
            <p className="text-brown mb-[24px] max-md:mb-[0px] max-md:text-lg max-md:text-darkBrown">
              {client ? client.phone : ""}
            </p>
          </div>
        </div>

        {client ? (
          <div className="md:flex md:flex-col w-full mx-auto">
            <p className="text-xl text-brown mb-[24px] max-md:text-lg max-md:mb-[0px]">
              {dictionary[selectedLanguage].profileEdit}
            </p>
            <div className="md:grid md:grid-cols-3">
              <div className="p-[10px] max-md:py-[0px]">
                <TextField
                  name={"name"}
                  type={"text"}
                  placeholder={dictionary[selectedLanguage].yourName}
                  label={dictionary[selectedLanguage].userName}
                  value={data.name}
                  onChange={handleChange}
                ></TextField>
                <label
                  className="block text-brown text-lg mb-[8px] max-md:text-sm"
                  htmlFor={"birthday"}
                >
                  {dictionary[selectedLanguage].birthday}
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={data.birthday ? data.birthday : client?.birthdate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      birthday: e.target.value,
                    }))
                  }
                  className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px] mb-[8px]"
                />
              </div>
              <div className="p-[10px]">
                <TextField
                  name={"telegram"}
                  type={"text"}
                  placeholder={"@telegram"}
                  label={"Telegram"}
                  value={data.telegram}
                  onChange={handleChange}
                ></TextField>
                <TextField
                  name={"instagram"}
                  type={"text"}
                  placeholder={"@instagram"}
                  label={"Instagram"}
                  value={data.instagram}
                  onChange={handleChange}
                ></TextField>
                <TextField
                  name={"email"}
                  type={"text"}
                  placeholder={"email@email.com"}
                  label={"E-mail"}
                  value={data.email}
                  onChange={handleChange}
                ></TextField>
              </div>
              <div className="p-[10px]">
                <img
                  src={selectedPreview}
                  alt=""
                  className="h-[155px] w-[155px] mx-auto rounded-full"
                />
                <label
                  className="block text-brown text-lg mb-[8px]"
                  htmlFor={"file"}
                >
                  {"Фото"}
                </label>
                <input
                  className="py-2 px-3 block w-full text-sm text-lightBrown placeholder-lightBrown border border-lightBrown rounded-lg cursor-pointer bg-white focus:outline-none file:text-brown file:bg-cream file:rounded-lg file:border-lightBrown file:outline-none file:border file:hover:opacity-80 file:cursor-pointer"
                  id={"file"}
                  name={"file"}
                  type={"file"}
                  accept="image/*"
                  capture
                  placeholder={""}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <button
              className="bg-brown rounded-lg text-white text-center mx-auto w-[25%] py-[8px] mt-[24px] hover:opacity-80"
              onClick={handleSubmit}
            >
              {dictionary[selectedLanguage].confirm}
            </button>
          </div>
        ) : (
          "loading"
        )}
      </ContainerBox>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default ClientProfilePage
