import React from "react"
import AuthBackground from "../components/auth/authBackground"
import AuthCard from "../components/auth/authCard"
import UserLoginForm from "../components/auth/userLoginForm"

const ClientLoginPage = () => {
  return (
    <div className="container-fluid relative h-screen mx-auto flex justify-center items-center bg-cream max-md:text-sm">
      <AuthCard>
        <UserLoginForm></UserLoginForm>
      </AuthCard>

      <AuthBackground></AuthBackground>
    </div>
  )
}

export default ClientLoginPage
