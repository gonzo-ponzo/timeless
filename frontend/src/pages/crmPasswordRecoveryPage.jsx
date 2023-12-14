import React, { useState } from "react"
import AuthBackground from "../components/auth/authBackground"
import AuthCard from "../components/auth/authCard"
import TextField from "../components/textField"
import dictionary from "../utils/dictionary"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import userService from "../services/user.service"

const CrmPasswordRecoveryPage = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const [data, setData] = useState({
    phone: "+",
  })

  let phoneError
  if (data.phone.startsWith("+3") && data.phone.length !== 13) {
    phoneError = "phone must contain 12 digits"
  }
  if (data.phone.startsWith("+7") && data.phone.length !== 12) {
    phoneError = "phone must contain 11 digits"
  }
  if (
    !data.phone.startsWith("+3") &&
    !data.phone.startsWith("+7") &&
    data.phone.length > 1
  ) {
    phoneError = "phone must start  with '7' or '3'"
  }

  const handleChange = (target) => {
    if (!data.phone.startsWith("+")) {
      setData((prevState) => ({
        ...prevState,
        [target.name]: "+" + target.value,
      }))
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await userService.passwordRecovery(data.phone)
    navigate("/crm/login")
  }

  return (
    <div className="container-fluid relative h-screen mx-auto flex justify-center items-center bg-cream max-md:text-sm">
      <AuthCard>
        <form onSubmit={handleSubmit}>
          <p className="text-brown mb-[4px] text-2xl max-md:text-lg">
            {dictionary[selectedLanguage].passwordRecovery}
          </p>
          <p className="text-brown mb-[4px] text-sm">
            {dictionary[selectedLanguage].passwordRecoveryDescrcription}
          </p>
          <TextField
            name="phone"
            label={dictionary[selectedLanguage].phoneNumber}
            placeholder="+1234567890"
            type="text"
            value={data.phone}
            onChange={handleChange}
            error={phoneError}
          />
          <button
            className="bg-brown rounded-lg text-white text-center w-full py-[8px] mt-[24px] hover:opacity-80"
            disabled={phoneError || data.phone.length < 2 ? true : false}
          >
            {dictionary[selectedLanguage].recover}
          </button>
        </form>
      </AuthCard>

      <AuthBackground></AuthBackground>
    </div>
  )
}

export default CrmPasswordRecoveryPage
