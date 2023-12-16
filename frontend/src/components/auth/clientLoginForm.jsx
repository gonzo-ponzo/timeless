import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import OTPInput from "./OTPInput"
import TextField from "../textField"
import localStorageService from "../../services/localStorage.service"
import authService from "../../services/auth.service"
import { useDispatch } from "react-redux"
import { loginClient } from "../../store/authSlice"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"

const ClientLoginForm = () => {
  const [otp, setOtp] = useState("")
  const [stage, setStage] = useState(false)
  const navigate = useNavigate()
  const [data, setData] = useState({
    phone: "+",
    code: "",
  })
  const dispatch = useDispatch()
  const selectedLanguage = useSelector((state) => state.lang.lang)

  let phoneError
  if (
    data.phone.startsWith("+3") &&
    (data.phone.length > 13 || data.phone.length < 12)
  ) {
    phoneError = "phone must contain 11-12 digits"
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
  const phoneValid =
    /^\+3\d{10}$/.test(data.phone) ||
    /^\+3\d{11}$/.test(data.phone) ||
    /^\+7\d{10}$/.test(data.phone)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stage) {
      const { phone } = await authService.getClientAuthCode(data.phone)
      localStorageService.setClientPhone(phone)
      setStage(true)
    } else {
      const phone = localStorageService.getClientPhone()
      const authData = await authService.clientLogin(phone, otp)
      if (authData) {
        localStorageService.setClientTokens({ ...authData })
        dispatch(loginClient())
        navigate("/client")
      }
    }
  }

  const handleChange = (target) => {
    if (target.name === "phone") {
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
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {stage ? (
        <>
          <p className="text-brown mb-[4px] text-2xl max-md:text-lg">
            {dictionary[selectedLanguage].confirm}
          </p>
          <p className="text-lightBrown mb-[24px] text-sm drop-shadow-2xl">
            {dictionary[selectedLanguage].smsCode}
          </p>
          <OTPInput
            length={5}
            className="mx-auto mb-[24px] flex justify-between"
            inputClassName="w-[65px] h-[65px] max-md:w-[50px] max-md:h-[50px] border border-solid border-brown text-brown rounded-lg bg-cream text-center outline-none focus:border-2"
            isNumberInput
            autoFocus
            onChangeOTP={(otp) => setOtp(otp)}
          />
          <button
            className="bg-brown rounded-lg text-white text-center w-full py-[8px] mt-[24px] hover:opacity-80"
            type="submit"
            disabled={otp.length < 5}
          >
            {dictionary[selectedLanguage].confirm}
          </button>
        </>
      ) : (
        <>
          <p className="text-brown mb-[4px] text-2xl max-md:text-lg">
            {dictionary[selectedLanguage].enter}
          </p>
          <p className="text-lightBrown mb-[24px] text-sm drop-shadow-2xl">
            {dictionary[selectedLanguage].phoneToLogin}
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
            disabled={
              phoneError || data.phone.length < 2 ? true : false || !phoneValid
            }
          >
            {dictionary[selectedLanguage].login}
          </button>
        </>
      )}
    </form>
  )
}

export default ClientLoginForm
