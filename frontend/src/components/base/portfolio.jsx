import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"

import Slider1 from "../../assets/imgs/base/images for slider/1.jpg"
import Slider2 from "../../assets/imgs/base/images for slider/2.jpg"
import Slider3 from "../../assets/imgs/base/images for slider/3.jpg"
import Slider4 from "../../assets/imgs/base/images for slider/4.jpg"
import Slider5 from "../../assets/imgs/base/images for slider/5.jpg"
import Slider6 from "../../assets/imgs/base/images for slider/6.jpg"
import Slider7 from "../../assets/imgs/base/images for slider/7.jpg"

const Portfolio = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const windowWidth = window.innerWidth
  let slidesCount
  if (windowWidth <= 400) {
    slidesCount = 1
  } else if (windowWidth <= 7400) {
    slidesCount = 2
  } else {
    slidesCount = 3
  }

  return (
    <section
      id="Portfolio"
      className="bg-[#FBF9F2] w-full pt-[32px] max-[400px]:p-2"
    >
      <section>
        <div>
          <h3 className="text-center text-[#9C783E]">
            - {dictionary[selectedLanguage].portfolio} -
          </h3>
          <h1 className="text-center font-bold text-2xl text-[#9C783E] mb-[24px]">
            {dictionary[selectedLanguage].portfolioTitle}
          </h1>
        </div>
        <div className="container mx-auto">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            spaceBetween={30}
            centeredSlides={true}
            slidesPerView={slidesCount ? slidesCount : 1}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="p-[100px]"
          >
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider1}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider2}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider3}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider4}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider5}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider6}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="w-[520px] h-[540px] rounded-xl object-cover"
                src={Slider7}
                alt=""
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </section>
  )
}

export default Portfolio
