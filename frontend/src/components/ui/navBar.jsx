import React, { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../../assets/imgs/logo-cream.svg"
import { useSelector } from "react-redux"
import localStorageService from "../../services/localStorage.service"
import userService from "../../services/user.service"
import clientService from "../../services/client.service"

import LanguageSelector from "./languageSelector"
import dictionary from "../../utils/dictionary"

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const crmPage = location.pathname.startsWith("/crm")
  const clientPage = location.pathname.startsWith("/client")
  const isLoggedInAsClient = localStorageService.getClientAccessToken()
  const isLoggedInAsUser = localStorageService.getUserAccessToken()
  const selectedLanguage = useSelector((state) => state.lang.lang)

  const loadData = async () => {
    if (isLoggedInAsUser && crmPage) {
      const user = await userService.getUserById(
        localStorageService.getUserId()
      )
      if (!user) {
        localStorageService.removeUserAuthData()
        navigate("/crm/login")
      }
    }
    if (isLoggedInAsClient && !crmPage) {
      const client = await clientService.getClientById(
        localStorageService.getClientId()
      )
      if (!client) {
        localStorageService.removeClientAuthData()
        navigate("/client/login")
      }
    }
  }

  useEffect(() => {
    loadData()
  })

  const handleUserLogout = () => {
    localStorageService.removeUserAuthData()
    navigate("/crm/login")
  }

  const handleClientLogout = () => {
    localStorageService.removeClientAuthData()
    navigate("/client/login")
  }

  if (crmPage) {
    const phone = isLoggedInAsUser ? localStorageService.getUserPhone() : null

    return (
      <div className="w-full bg-cream text-brown relative max-md:text-sm">
        <LanguageSelector></LanguageSelector>
        <nav className="mx-auto max-w-[1496px] pt-[16px] pb-[32px] justify-between items-center ">
          <img className="mx-auto mb-[20px]" src={logo} alt="" />
          <div className="flex justify-center items-center pb-[38px] max-md:flex-wrap">
            {!isLoggedInAsUser ? (
              <Link
                to="/crm/login"
                className="hover:opacity-80 max-md:mb-[10px]"
              >
                {dictionary[selectedLanguage].login}
              </Link>
            ) : (
              <>
                <Link
                  to="/crm"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].home}
                </Link>
                <Link
                  to="/crm/calendar"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].calendar}
                </Link>
                <Link
                  to="/crm/salary"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].salary}
                </Link>
                <Link
                  to="/crm/feedbacks"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].feedbacks}
                </Link>
                <Link
                  to="/crm/profile"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].you}
                  {phone}
                </Link>
                <button
                  className="hover:opacity-80  max-md:mb-[10px]"
                  onClick={handleUserLogout}
                >
                  {dictionary[selectedLanguage].logout}
                </button>
              </>
            )}
          </div>
          <hr className="w-full mx-auto border border-brown" />
        </nav>
      </div>
    )
  } else if (clientPage) {
    const phone = isLoggedInAsClient
      ? localStorageService.getClientPhone()
      : null

    return (
      <div className="w-full bg-cream text-brown max-md:text-sm">
        <LanguageSelector></LanguageSelector>
        <nav className="mx-auto max-w-[1496px] pt-[16px] pb-[32px] justify-between items-center ">
          <img className="mx-auto mb-[20px]" src={logo} alt="" />
          <div className="flex justify-center items-center pb-[38px] max-md:flex-wrap">
            <Link
              to="/client"
              className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
            >
              {dictionary[selectedLanguage].home}
            </Link>
            <Link
              to="/client/record"
              className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
            >
              {dictionary[selectedLanguage].record}
            </Link>
            <Link
              to="/client/feedback"
              className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
            >
              {dictionary[selectedLanguage].feedback}
            </Link>
            <Link
              to="/client/masters"
              className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
            >
              {dictionary[selectedLanguage].masters}
            </Link>
            {!isLoggedInAsClient ? (
              <Link
                to="/client/login"
                className="hover:opacity-80 max-md:mb-[10px]"
              >
                {dictionary[selectedLanguage].login}
              </Link>
            ) : (
              <>
                <Link
                  to="/client/profile"
                  className="mr-[52px] max-md:mr-[15px] hover:opacity-80 max-md:mb-[10px]"
                >
                  {dictionary[selectedLanguage].you}
                  {phone}
                </Link>
                <button
                  className="hover:opacity-80 max-md:mb-[10px]"
                  onClick={handleClientLogout}
                >
                  {dictionary[selectedLanguage].logout}
                </button>
              </>
            )}
          </div>
          <hr className="w-full mx-auto border border-brown" />
        </nav>
      </div>
    )
  } else {
    return null
  }
}

export default NavBar
