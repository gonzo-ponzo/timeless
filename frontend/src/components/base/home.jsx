import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"
import Image from "../../assets/imgs/base/Image.png"

const Home = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <section
      id="Home"
      className="bg-[#F7F4EA] pb-[24px] pt-[250px] max-[400px]:pt-[175px] relative font-serif"
    >
      <div className="container md:mx-auto sm:mx-auto mx-auto justify-center items-center gap-2 max-[400px]:p-2">
        <h1 className="text-5xl font-bold text-[#9C783E] text-center max-[400px]:text-2xl">
          {dictionary[selectedLanguage].unlock}
        </h1>
        <p className="italic text-base font-normal text-[#9C783E] text-center max-w-4xl mx-auto mt-4 mb-8">
          {dictionary[selectedLanguage].unlockLg}
        </p>
        <div className="max-w-6xl flex justify-center mx-auto rounded-3xl overflow-hidden bg-cover bg-no-repeat">
          <img
            className="max-w-6xl justify-center transition duration-300 hover:scale-110 ease-in-out hover:rounded-3xl rounded-3xl max-[400px]:max-w-3xl"
            src={Image}
            alt=""
          />
        </div>
      </div>
    </section>
  )
}

export default Home
