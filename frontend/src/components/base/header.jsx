import { Link } from "react-router-dom"
import {
  Link as SLink,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"
import Logo from "../../assets/imgs/base/logo.svg"
import LanguageSelector from "../ui/languageSelector"

const Header = () => {
  useEffect(() => {
    scrollSpy.update()
    return () => {
      Events.scrollEvent.remove("begin")
      Events.scrollEvent.remove("end")
    }
  }, [])

  const handleSetActive = (to) => {
    console.log(to)
  }

  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <header
      id="main-header"
      className="bg-[#F7F4EA] border-b border-[#9C783E] fixed w-screen top-0 left-0 right-0 mt-0 pt-[4px] max-[400px]:pt-[16px] z-[999]"
    >
      <div className="container mx-auto px-8 max-[740px]:p-4  min-[420px]:flex-wrap flex justify-between items-center">
        <LanguageSelector></LanguageSelector>

        <div className="max-[400px]:hidden"></div>

        <div
          id="logo"
          className="flex justify-center mb-[6px] max-[400px]:mb-0"
        >
          <img src={Logo} alt="Logo" className="w-full max-[400px]:w-[175px]" />
        </div>

        <div>
          <Link
            to="/client/login"
            className="px-8 py-4 max-[400px]:text-xs max-[400px]:px-2 max-[400px]:py-2 hover:bg-lightBrown text-white transition rounded-md bg-brown font-serif"
          >
            {dictionary[selectedLanguage].login}
          </Link>
        </div>
      </div>

      <div className="flex mx-auto justify-center m-[8px]">
        <nav>
          <ul className="flex flex-wrap justify-center gap-5 max-[400px]:gap-0 max-[740px]:gap-2 font-serif text-brown">
            <li>
              <SLink
                activeClass="active"
                to="Home"
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
                onSetActive={handleSetActive}
                className="px-8 py-2 hover:bg-[#FFF8E1] max-[740px] max-[400px]:text-sm transition rounded-md  scroll-smooth"
              >
                {dictionary[selectedLanguage].home}
              </SLink>
            </li>
            <li>
              <SLink
                activeClass="active"
                to="Portfolio"
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
                className="px-8 py-2 hover:bg-[#FFF8E1] max-[740px] max-[400px]:text-sm transition rounded-md"
              >
                {dictionary[selectedLanguage].portfolio}
              </SLink>
            </li>
            <li>
              <SLink
                activeClass="active"
                to="About-us"
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
                className="px-8 py-2 hover:bg-[#FFF8E1] max-[740px] max-[400px]:text-sm transition rounded-md"
              >
                {dictionary[selectedLanguage].about}
              </SLink>
            </li>
            <li>
              <SLink
                activeClass="active"
                to="Team"
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
                className="px-8 py-2 hover:bg-[#FFF8E1] max-[740px] max-[400px]:text-sm transition rounded-md"
              >
                {dictionary[selectedLanguage].team}
              </SLink>
            </li>
            <li>
              <SLink
                activeClass="active"
                to="Contact"
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
                className="px-8 py-2 hover:bg-[#FFF8E1] max-[740px] max-[400px]:text-sm transition rounded-md"
              >
                {dictionary[selectedLanguage].contacts}
              </SLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
