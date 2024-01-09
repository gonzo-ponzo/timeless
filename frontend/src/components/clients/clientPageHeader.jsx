import telegramLogo from "../../assets/imgs/telegram.png"
import phoneLogo from "../../assets/imgs/Vector.png"
import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import dictionary from "../../utils/dictionary"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import clientService from "../../services/client.service"
import TextField from "../textField"

const ClientPageHeader = ({
  client,
  clientsHistory,
  showFullHistory,
  setShowFullHistory,
  user,
}) => {
  const selectedLanguage = useSelector((state) => state.lang.lang)
  const notify = () => toast.success("Сохранено")
  const [showHistory, setShowHistory] = useState(false)
  const [data, setData] = useState({
    name: client ? client.name : "",
    email: client ? client.email : "",
    telegram: client ? client.telegram : "",
    instagram: client ? client.instagram : "",
    birthday: client ? client.birthdate : null,
    communication: client ? client.communication : true,
  })

  console.log(clientsHistory.map((monthHistory) => Object.keys(monthHistory)))
  const fullHistoryList = clientsHistory?.map((monthHistory) =>
    Object.keys(monthHistory.history)
      .reverse()
      .map((key) => (
        <p className="mb-[2px]">
          <b>{key}:</b> {monthHistory?.history[key]}
        </p>
      ))
  )

  const historyList = client?.history
    ? Object.keys(client?.history)
        .reverse()
        .map((key) => (
          <p className="mb-[2px]">
            <b>{key}:</b> {client?.history[key]}
          </p>
        ))
    : null

  useEffect(() => {
    setData({
      name: client?.name,
      email: client?.email,
      telegram: client?.telegram,
      instagram: client?.instagram,
      birthday: client?.birthday,
      communication: client?.communication,
    })
  }, [client])

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }))
  }

  const handleSubmit = async () => {
    await clientService.UpdateCurrentClient({
      clientId: client.id,
      name: data.name,
      email: data.email,
      telegram: data.telegram,
      instagram: data.instagram,
      birthday: data.birthday,
      communication: data.communication,
    })
    notify()
  }

  return (
    <>
      <div className="flex justify-between w-full items-center py-[20px]">
        <div className="md:flex md:justify-between w-full">
          <div className="flex">
            <img
              className="h-[200px] w-[200px] mr-[10px] rounded-full max-md:h-[100px] max-md:w-[100px]"
              src={client.image}
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-3xl">{client.name}</p>
              {user.isAdmin ? (
                <>
                  <div>
                    <a
                      className="flex items-center"
                      href={`http://www.t.me/${client?.telegram}`}
                    >
                      <img
                        className="h-[16px] w-[16px] mr-[6px]"
                        src={telegramLogo}
                        alt=""
                      />
                      <p>{client.telegram}</p>
                    </a>
                  </div>
                  <div className="flex items-center mb-[8px]">
                    <img
                      className="h-[16px] w-[16px] mr-[6px]"
                      src={phoneLogo}
                      alt=""
                    />
                    <p>
                      <a href={`tel:${client.phone}`}>{client.phone}</a>
                    </p>
                  </div>
                  <button
                    className="border max-w-[100px] max-h-[32px] border-lightBrown rounded-lg text-sm p-[2px]"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    {showHistory
                      ? dictionary[selectedLanguage].history
                      : dictionary[selectedLanguage].info}
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <div>
            <div className="flex flex-col w-full mx-auto">
              {user.isAdmin && !user.isStaff ? (
                showHistory ? (
                  <div className="w-full">
                    <div className="flex justify-center mb-[8px]">
                      <button
                        className="border max-w-[200px] max-h-[32px] border-lightBrown rounded-lg text-sm p-[2px]"
                        onClick={() => setShowFullHistory(!showFullHistory)}
                      >
                        {showFullHistory
                          ? dictionary[selectedLanguage].fullHistory
                          : dictionary[selectedLanguage].monthHistory}
                      </button>
                    </div>
                    <div className="overflow-y-scroll max-h-[240px] w-full flex-col p-[8px] border border-lightBrown rounded-lg">
                      {showFullHistory
                        ? fullHistoryList.reverse()
                        : historyList}
                    </div>
                  </div>
                ) : (
                  <div className="md:grid md:grid-cols-2">
                    <div className="p-[10px]">
                      <TextField
                        name={"name"}
                        type={"text"}
                        placeholder={""}
                        label={dictionary[selectedLanguage].userName}
                        value={data.name}
                        onChange={handleChange}
                      ></TextField>
                      <label
                        className="block text-brown text-lg mb-[8px] max-md:text-sm"
                        htmlFor={"birthday"}
                      >
                        {dictionary[selectedLanguage].birthday}
                      </label>
                      <input
                        type="text"
                        name="birthday"
                        onFocus={(e) => (e.target.type = "date")}
                        placeholder="DD.MM.YYYY"
                        value={
                          data.birthday ? data.birthday : client?.birthdate
                        }
                        onChange={(e) =>
                          setData((prevState) => ({
                            ...prevState,
                            birthday: e.target.value,
                          }))
                        }
                        className="border border-lightBrown text-lightBrown rounded-lg w-full px-[8px] py-[7px] mb-[8px]"
                      />
                      <button
                        className="bg-brown rounded-lg text-white text-center mx-auto w-full py-[8px] mt-[30px] hover:opacity-80 max-md:mt-[22px] max-md:hidden"
                        onClick={handleSubmit}
                      >
                        {dictionary[selectedLanguage].confirm}
                      </button>
                    </div>
                    <div className="p-[10px]">
                      <TextField
                        name={"telegram"}
                        type={"text"}
                        placeholder={""}
                        label={"Telegram"}
                        value={data.telegram}
                        onChange={handleChange}
                      ></TextField>
                      <TextField
                        name={"instagram"}
                        type={"text"}
                        placeholder={""}
                        label={"Instagram"}
                        value={data.instagram}
                        onChange={handleChange}
                      ></TextField>
                      <TextField
                        name={"email"}
                        type={"text"}
                        placeholder={""}
                        label={"E-mail"}
                        value={data.email}
                        onChange={handleChange}
                      ></TextField>
                      <div className="mt-[8px]">
                        <label
                          className="mr-[6px] text-lg text-darkBrown"
                          for="communication"
                        >
                          {dictionary[selectedLanguage].communication}
                        </label>
                        <input
                          className="border-lightBrown border border-radius-xl"
                          type="checkbox"
                          name="communication"
                          checked={data.communication}
                          onChange={() =>
                            setData((prevState) => ({
                              ...prevState,
                              communication: !data.communication,
                            }))
                          }
                        />
                      </div>
                      <button
                        className="bg-brown rounded-lg text-white text-center mx-auto w-full py-[8px] mt-[30px] hover:opacity-80 max-md:mt-[22px] md:hidden"
                        onClick={handleSubmit}
                      >
                        {dictionary[selectedLanguage].confirm}
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

ClientPageHeader.propTypes = {
  client: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default ClientPageHeader
