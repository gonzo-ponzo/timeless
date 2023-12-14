import React from "react"
import Header from "../components/base/header"
import Home from "../components/base/home"
import Portfolio from "../components/base/portfolio"
import About from "../components/base/about"
import Team from "../components/base/team"
import Contacts from "../components/base/contacts"
import Footer from "../components/base/footer"

const StartPage = () => {
  // class PushNotification extends React.Component {
  //   handleNotification() {
  //     // Проверяем, поддерживается ли API для уведомлений
  //     if (!("Notification" in window)) {
  //       alert("Push-уведомления не поддерживаются в вашем браузере")
  //     }

  //     // Проверяем, разрешил ли пользователь уведомления
  //     else if (Notification.permission === "granted") {
  //       // Создаем новое push-уведомление
  //       new Notification("Пример уведомления", {
  //         body: "Это пример уведомления, созданного с помощью Notification API",
  //       })
  //     }

  //     // Если пользователь не разрешил уведомления, запрашиваем доступ
  //     else if (Notification.permission !== "denied") {
  //       Notification.requestPermission().then(function (permission) {
  //         // Если пользователь разрешил, создаем уведомление
  //         if (permission === "granted") {
  //           new Notification("Пример уведомления", {
  //             body: "Это пример уведомления, созданного с помощью Notification API",
  //           })
  //         }
  //       })
  //     }
  //   }

  //   render() {
  //     return (
  //       <button onClick={this.handleNotification}>Создать уведомление</button>
  //     )
  //   }
  // }
  return (
    <div className=" scroll-smooth">
      <Header />
      <Home />
      <Portfolio />
      <About />
      <Team />
      <Contacts />
      {/* <PushNotification /> */}

      <Footer />
    </div>
  )
}

export default StartPage
