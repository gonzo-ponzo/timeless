import dropdownArrow from "../../assets/imgs/dropdown-arrow.png"
import ruFlag from "../../assets/imgs/ru.png"
import enFlag from "../../assets/imgs/en.png"
import srFlag from "../../assets/imgs/sr.png"
import localStorageService from "../../services/localStorage.service"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setStoreLanguage } from "../../store/languageSlice"

const LanguageSelector = () => {
  const dispatch = useDispatch()
  if (!localStorageService.getLanguage()) {
    localStorageService.setLanguage("en")
  }
  const selectedLanguage = localStorageService.getLanguage()

  const languages = [
    { name: "Русский", symbols: "ru", logo: ruFlag },
    { name: "English", symbols: "en", logo: enFlag },
    { name: "Српски", symbols: "sr", logo: srFlag },
  ]
  const [showDropdown, setShowDropdown] = useState(false)
  const languagesDropdown = languages.filter(
    (language) => language.symbols !== selectedLanguage
  )

  const handleClick = () => {
    setShowDropdown(!showDropdown)
  }

  const handleSelectLanguage = (language) => {
    setShowDropdown(!showDropdown)
    localStorageService.setLanguage(language.symbols)
    dispatch(setStoreLanguage(language.symbols))
  }

  return (
    <div className="flex flex-col justify-start items-start absolute top-[25px] max-md:top-[3px] left-[25px] max-md:left-[3px] bg-white px-[6px] py-[6px] max-md:p-[3px] rounded-lg border-2 border-gray">
      <div
        className="flex items-center cursor-pointer hover:opacity-70"
        onClick={handleClick}
      >
        <img
          className="w-[28px] h-[20px] mr-[4px]"
          src={
            languages.find((language) => language.symbols === selectedLanguage)
              ?.logo
          }
          alt=""
        />
        <p>
          {
            languages.find((language) => language.symbols === selectedLanguage)
              ?.name
          }
        </p>
        <img
          className={`w-[14px] h-[14px] ml-[10px] ${
            showDropdown ? "rotate-180" : ""
          }`}
          src={dropdownArrow}
          alt=""
        />
      </div>
      {showDropdown
        ? languagesDropdown.map((language) => (
            <div
              key={language.symbols}
              className="flex items-center cursor-pointer hover:opacity-70"
              onClick={() => handleSelectLanguage(language)}
            >
              <img
                className="w-[28px] h-[20px] mr-[4px]"
                src={language.logo}
                alt=""
              />
              <p className="mr-[18px]">{language.name}</p>
            </div>
          ))
        : null}
    </div>
  )
}

export default LanguageSelector
