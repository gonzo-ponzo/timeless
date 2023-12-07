import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"
import Image from "../../assets/imgs/base/studio.jpg"

const About = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <section className="bg-[#F7F4EA] items-center pb-32 max-[400px]:pb-[16px] pt-[250px] max-[400px]:pt-[50px] max-[400px]:px-2">
      <div className="container items-center mx-auto">
        <section id="About-us" className="mb-32 max-[400px]:mb-[16px]">
          <div className="block rounded-lg bg-[#b8a68a] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center">
              <div className="flex w-4/12 max-[740px]:w-full">
                <img
                  src={Image}
                  alt="Trendy Pants and Shoes"
                  className="aspect-auto rounded-lg lg:rounded-tr-none lg:rounded-bl-lg "
                />
              </div>
              <div className="w-8/12 max-[740px]:w-full">
                <div className="px-12 py-12">
                  <h2 className="mb-4 text-2xl font-semibold text-white font-serif  max-[400px]:text-xl">
                    {dictionary[selectedLanguage].aboutTitle}
                  </h2>
                  <p className="mb-6 flex items-center font-bold uppercase text-danger text-white font-serif">
                    {dictionary[selectedLanguage].aboutDescr}
                  </p>
                  <p className="mb-6 font-normal italic text-white font-serif">
                    {dictionary[selectedLanguage].aboutDescrLg}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default About
