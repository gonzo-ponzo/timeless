import React from "react"
import Header from "../components/base/header"
import Home from "../components/base/home"
import Portfolio from "../components/base/portfolio"
import About from "../components/base/about"
import Team from "../components/base/team"
import Contacts from "../components/base/contacts"
import Footer from "../components/base/footer"

const StartPage = () => {
  return (
    <div className=" scroll-smooth">
      <Header />
      <Home />
      <Portfolio />
      <About />
      <Team />
      <Contacts />
      <Footer />
    </div>
  )
}

export default StartPage
