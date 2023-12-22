import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import TextField from "../textField"
import localStorageService from "../../services/localStorage.service"
import authService from "../../services/auth.service"
import { useDispatch } from "react-redux"
import { loginUser } from "../../store/authSlice"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"
import userService from "../../services/user.service"
import { Link } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

const ClientLoginForm = () => {
  const userId = localStorageService.getUserId()
  const [user, setUser] = useState(null)
  const loadData = async (userId) => {
    setUser(await userService.getUserById(userId))
  }
  useEffect(() => {
    if (userId) {
      loadData(userId)
    }
  }, [userId])

  const selectedLanguage = useSelector((state) => state.lang.lang)
  const navigate = useNavigate()
  const [data, setData] = useState({
    phone: "+",
    password: "",
  })
  const dispatch = useDispatch()

  let phoneError
  if (
    data.phone.startsWith("+3") &&
    !(/^\+3\d{10}$/.test(data.phone) || /^\+3\d{11}$/.test(data.phone))
  ) {
    phoneError = "phone must contain 11-12 digits"
  }
  if (data.phone.startsWith("+7") && !/^\+7\d{10}$/.test(data.phone)) {
    phoneError = "phone must contain 11 digits"
  }
  if (
    !data.phone.startsWith("+3") &&
    !data.phone.startsWith("+7") &&
    data.phone.length > 1
  ) {
    phoneError = "phone must start  with '7' or '3'"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const authData = await authService.userLogin(data.phone, data.password)
    if (authData) {
      localStorageService.setUserTokens({ ...authData })
      dispatch(loginUser())
      navigate("/crm")
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
  const [reCaptcha, setReCaptcha] = useState(null)
  const recaptchaRef = React.createRef()
  const handleReCaptcha = () => {
    const recaptchaValue = recaptchaRef.current.getValue()
    setReCaptcha(recaptchaValue)
  }
  const reCaptchaKey = process.env.REACT_APP_RECAPTCHA_WEB_KEY

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-brown mb-[4px] text-2xl max-md:text-lg">
        {dictionary[selectedLanguage].login}
      </p>
      {localStorageService.getUserAccessToken() && !user?.isStaff ? (
        <p className="text-red">Contact admin to get access</p>
      ) : (
        <p className="text-lightBrown mb-[24px] text-sm drop-shadow-2xl">
          {dictionary[selectedLanguage].phoneNumberWithPassword}
        </p>
      )}
      <TextField
        name="phone"
        label={dictionary[selectedLanguage].phoneNumber}
        placeholder="+1234567890"
        type="text"
        value={data.phone}
        onChange={handleChange}
        error={phoneError}
      />
      <TextField
        name="password"
        label={dictionary[selectedLanguage].password}
        placeholder={dictionary[selectedLanguage].enterPassword}
        type="password"
        onChange={handleChange}
      />
      <div className="mt-[10px] w-full flex justify-center items-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={reCaptchaKey}
          onChange={handleReCaptcha}
          size="compact"
        />
      </div>
      <button
        className="bg-brown rounded-lg text-white text-center w-full py-[8px] mt-[24px] hover:opacity-80"
        disabled={
          phoneError || data.phone.length < 2 || !reCaptcha ? true : false
        }
      >
        {dictionary[selectedLanguage].login}
      </button>
      <Link to={"/crm/password-recovery"}>
        {dictionary[selectedLanguage].passwordRecovery}
      </Link>
    </form>
  )
}

export default ClientLoginForm
