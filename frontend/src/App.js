import "./index.css"
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import store from "./store/store"
import AppLoader from "./components/hoc/appLoader"
import { Provider } from "react-redux"

import NavBar from "./components/ui/navBar"
import UserLoginPage from "./pages/userLoginPage"
import ClientLoginPage from "./pages/clientLoginPage"
import ClientMainPage from "./pages/clientMainPage"
import FeedbackPage from "./pages/feedbackPage"
import MastersPage from "./pages/mastersPage"
import ClientProfilePage from "./pages/clientProfilePage"
import CrmMainPage from "./pages/crmMainPage"
import ClientsPage from "./pages/clientsPage"
import ClientPage from "./pages/clientPage"
import MasterPage from "./pages/masterPage"
import CrmProfilePage from "./pages/crmProfilePage"
import ClientCalendarPage from "./pages/clientCalendarPage"
import CrmCalendarPage from "./pages/crmCalendarPage"
import StartPage from "./pages/startPage"
import CrmPasswordRecoveryPage from "./pages/crmPasswordRecoveryPage"
import NotFoundPage from "./pages/notFoundPage"

function App() {
  return (
    <>
      <Provider store={store}>
        <AppLoader>
          <BrowserRouter>
            <NavBar />

            <Routes>
              <Route path="/" element={<StartPage />} />

              <Route path="/crm/login" element={<UserLoginPage />} />
              <Route
                path="/crm/password-recovery"
                element={<CrmPasswordRecoveryPage />}
              />
              <Route path="/client/login" element={<ClientLoginPage />} />

              <Route path="/client/record" element={<ClientCalendarPage />} />
              <Route path="/crm/calendar" element={<CrmCalendarPage />} />

              <Route path="/client/feedback" element={<FeedbackPage />} />

              <Route path="/crm/feedbacks" element={<ClientsPage />} />
              <Route path="/client/masters" element={<MastersPage />} />

              <Route path="/crm/profile" element={<CrmProfilePage />} />
              <Route path="/client/profile" element={<ClientProfilePage />} />

              <Route path="/client/master/:userId" element={<MasterPage />} />
              <Route path="/crm/client/:clientId" element={<ClientPage />} />

              <Route path="/crm" element={<CrmMainPage />} />
              <Route path="/client" element={<ClientMainPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AppLoader>
      </Provider>
    </>
  )
}

export default App
