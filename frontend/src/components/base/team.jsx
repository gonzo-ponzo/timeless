import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"
import Image1 from "../../assets/imgs/base/team images/1.jpg"
import Image2 from "../../assets/imgs/base/team images/2.jpg"
import Image3 from "../../assets/imgs/base/team images/3.jpg"

const Team = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <>
      <section className="relative pb-[24px] mx-auto bg-[#F7F4EA] font-serif max-[400px]:px-2">
        <section className="container mb-[32px] mx-auto lg:text-left">
          <h2
            id="Team"
            className="mb-12 text-center text-3xl text-[#9C783E] font-bold max-[400px]:text-2xl"
          >
            {dictionary[selectedLanguage].meet}{" "}
            <u>{dictionary[selectedLanguage].teamLow}</u>
          </h2>

          <div className="grid gap-8 px-auto md:grid-cols-3 xl:gap-x-12 mx-auto justify-center text-white">
            <div className="mb-16 lg:mb-0">
              <div className="relative rounded-lg p-4 bg-[#b8a68a]">
                <div className="flex-row items-center lg:flex">
                  <div className="w-full lg:w-5/12 lg:pr-6">
                    <img
                      src={Image1}
                      alt="Trendy Pants and Shoes"
                      className="mb-6 w-full rounded-md lg:mb-0"
                    />
                  </div>
                  <div className="w-full lg:w-7/12">
                    <h5 className="mb-2 text-lg font-bold">Arina Usoltseva</h5>
                    <p className="mb-4">{dictionary[selectedLanguage].cqs}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 lg:mb-0">
              <div className="relative rounded-lg p-4 bg-[#b8a68a]">
                <div className="flex-row items-center lg:flex">
                  <div className="w-full lg:w-5/12 lg:pr-6">
                    <img
                      src={Image3}
                      alt=""
                      className="mb-6 w-full rounded-md lg:mb-0"
                    />
                  </div>
                  <div className="w-full lg:w-7/12">
                    <h5 className="mb-2 text-lg font-bold">
                      Valeriia Vyskrebova
                    </h5>
                    <p className="mb-4 text-white">
                      {dictionary[selectedLanguage].lm}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 lg:mb-0">
              <div className="relative rounded-lg p-4 bg-[#b8a68a]">
                <div className="flex-row items-center lg:flex">
                  <div className="w-full lg:w-5/12 lg:pr-6">
                    <img
                      src={Image2}
                      alt="Admin"
                      className="mb-6 w-full rounded-md lg:mb-0"
                    />
                  </div>
                  <div className="w-full h-full my-auto lg:w-7/12">
                    <h5 className="mb-2 text-lg font-bold">Katarina Ilijin</h5>
                    <p className="mb-4 text-white">
                      {dictionary[selectedLanguage].am}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

export default Team
