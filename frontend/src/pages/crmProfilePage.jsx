import React, { useEffect, useState } from "react"
import ContainerBox from "../components/ui/containerBox"
import TextField from "../components/textField"
import userService from "../services/user.service"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import localStorageService from "../services/localStorage.service"
import { useNavigate } from "react-router-dom"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"

const CrmProfilePage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success(dictionary[selectedLanguage].success)
  const navigate = useNavigate()
  const userId = localStorageService.getUserId()
  if (!userId) {
    navigate("/crm/login")
  }
  const windowWidth = window.innerWidth

  const [user, setUser] = useState(null)
  const [selectedImage, setSelectedImage] = useState()
  const [password, setPassword] = useState("")
  const [selectedPreview, setSelectedPreview] = useState(user?.image)
  const [data, setData] = useState({
    name: user ? user.name : "",
    position: user ? user.email : "",
    experience: user ? user.telegram : "",
    birthday: user ? user.birthdate : null,
  })

  const loadData = async (userId, user) => {
    setUser(await userService.getUserById(userId))
  }
  useEffect(() => {
    loadData(userId)
  }, [userId])

  useEffect(() => {
    setSelectedPreview(user?.image)
    setData({
      name: user?.name,
      position: user?.position,
      experience: user?.experience,
      birthday: user?.birthdate,
    })
  }, [user])

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
    const userId = user.id
    await userService.UpdateCurrentUser({
      userId,
      name: data.name,
      position: data.position,
      experience: data.experience,
      birthday: data.birthday,
      password: password,
    })
    if (selectedImage) {
      const formData = new FormData()
      formData.append("image", selectedImage)
      await userService.UploadUserImage(userId, formData)
    }
    notify()
  }

  if (user) {
    if (user.isStaff || user.isAdmin) {
      return (
        <div className="container-fluid relative mx-auto h-[calc(100vh-252px)] flex justify-center items-start bg-cream max-md:text-sm">
          <ContainerBox>
            <div className="flex justify-between">
              <div className="max-md:flex max-md:justify-between max-md:items-center max-md:w-full max-md:flex-row-reverse">
                <h2 className="text-darkBrown text-2xl max-md:text-lg max-md:mr-[6px]">
                  {dictionary[selectedLanguage].yourProfile}
                </h2>
                <p className="text-brown mb-[24px] max-md:mb-[0px] max-md:text-lg max-md:text-darkBrown">
                  {user ? user.phone : ""}
                </p>
              </div>
            </div>

            {user ? (
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
                      value={data.birthday ? data.birthday : user?.birthdate}
                      onChange={(e) =>
                        setData((prevState) => ({
                          ...prevState,
                          birthday: e.target.value,
                        }))
                      }
                      className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px] mb-[8px]"
                    />
                    <label
                      className="block text-brown text-lg mb-[8px] max-md:text-sm"
                      htmlFor={"password"}
                    >
                      {dictionary[selectedLanguage].password}
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px] mb-[8px]"
                    />
                  </div>
                  <div className="p-[10px]">
                    <TextField
                      name={"position"}
                      type={"text"}
                      placeholder={dictionary[selectedLanguage].master}
                      label={dictionary[selectedLanguage].position}
                      value={data.position}
                      onChange={handleChange}
                    ></TextField>
                    <TextField
                      name={"experience"}
                      type={"text"}
                      placeholder={"1"}
                      label={dictionary[selectedLanguage].experience}
                      value={data.experience}
                      onChange={handleChange}
                    ></TextField>
                  </div>
                  <div className="p-[10px]">
                    <img
                      src={selectedPreview}
                      alt=""
                      className="h-[155px] w-[155px] mx-auto rounded-s"
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
                      accept={windowWidth < 800 ? "image/*, file/*" : "image/*"}
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
    } else {
      navigate("/crm/login")
    }
  }
}

export default CrmProfilePage
