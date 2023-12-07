/* eslint-disable react/jsx-no-target-blank */
import { useSelector } from "react-redux"
import dictionary from "../../utils/dictionary"

const Contacts = () => {
  const selectedLanguage = useSelector((state) => state.lang.lang)

  return (
    <div className="w-full bg-[#F7F4EA]">
      <div
        id="Contact"
        className="container mx-auto bg-[#F7F4EA] max-[400px]:px-2"
      >
        <div className="pb-32 max-[400px]:pb-[32px]">
          <h2 className="pb-16 text-center text-3xl text-[#9C783E] font-bold">
            {dictionary[selectedLanguage].contacts}
          </h2>
          <div className="block rounded-lg bg-[#b8a68a]">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:flex lg:w-6/12 xl:w-4/12">
                <div className="h-[200px] w-full">
                  <iframe
                    title="map"
                    src={
                      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2808.5028863857437!2d19.8165161!3d45.2578443!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6f9afb04fe10bcf%3A0xc9f12d38c0298a98!2sTimeless%20beauty!5e0!3m2!1sen!2sru!4v1694069813400!5m2!1sen!2sru"
                    }
                    width={"600"}
                    height={"450"}
                    loading={"lazy"}
                    referrerpolicy={"no-referrer-when-downgrade"}
                    className={
                      "left-0 top-0 h-full w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
                    }
                    frameborder={"0"}
                    allowFullScreen={true}
                  ></iframe>
                </div>
              </div>
              <div className="w-full items-center lg:w-6/12 xl:w-8/12">
                <div className="flex items-center flex-wrap px-3 pt-12 pb-12 md:pb-0 lg:pt-0">
                  <div className="mb-auto w-full px-2 md:w-6/12 md:px-6 lg:w-full xl:w-6/12 xl:px-12">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <div className="inline-block items-center rounded-md bg-primary-100 p-2 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="2em"
                            viewBox="0 0 512 512"
                            style={{ fill: "#ffffff" }}
                          >
                            <path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z" />
                          </svg>
                        </div>
                      </div>
                      <div className="grid mb-2 items-center gap-5 ml-5 grow">
                        <a
                          href="tel:0693005555"
                          className="text-white text-lg max-[400px]:text-sm"
                        >
                          {dictionary[selectedLanguage].phoneNumber}:
                          069/300-5555
                        </a>
                        <a
                          href="mailto:info@timeless-beauty.rs"
                          className="text-white text-lg max-[400px]:text-sm"
                        >
                          Email: info@timeless-beauty.rs
                        </a>
                        <a
                          href="https://instagram.com/timelessrs"
                          target="_blank"
                          className="text-white text-lg max-[400px]:hidden"
                        >
                          Instagram: @timelessbeauty
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mb-auto w-full px-3 md:w-6/12 md:px-6 lg:w-full xl:w-6/12 xl:px-12 max-[740px]:hidden">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <div className="inline-block items-center rounded-md bg-primary-100 p-4 text-primary">
                          <i className="fa-solid fa-link fa-2x text-[#ffffff]"></i>
                        </div>
                      </div>
                      <div className="grid ml-5 mb-2 items-center gap-5 font-medium grow">
                        <a
                          href="https://t.me/+381693005555"
                          target="_blank"
                          className="text-white text-lg"
                        >
                          Telegram: +381693005555
                        </a>
                        <a
                          href="viber://chat?number=%2B381693005555"
                          target="_blank"
                          className="text-white text-lg"
                        >
                          Viber: +381693005555
                        </a>
                        <a
                          href="https://wa.me/+381693005555"
                          target="_blank"
                          className="text-white text-lg"
                        >
                          WhatsApp: +381693005555
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts
