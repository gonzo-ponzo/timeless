const CLIENT_TOKEN_KEY = "jwt-token"
const CLIENT_EXPIRES_KEY = "jwt-expires"
const CLIENT_ID_KEY = "client-id"
const CLIENT_PHONE_KEY = "client-phone"
const USER_TOKEN_KEY = "user-jwt-token"
const USER_EXPIRES_KEY = "user-jwt-expires"
const USER_ID_KEY = "user-id"
const USER_PHONE_KEY = "user-phone"
const LANGUAGE_KEY = "language"

export function setClientTokens({
  clientId,
  clientPhone,
  clientToken,
  clientExpiresIn = 60 * 60 * 24 * 30,
}) {
  const expiresDate = new Date().getTime() + clientExpiresIn * 1000
  localStorage.setItem(CLIENT_ID_KEY, clientId)
  localStorage.setItem(CLIENT_TOKEN_KEY, clientToken)
  localStorage.setItem(CLIENT_EXPIRES_KEY, expiresDate)
  localStorage.setItem(CLIENT_PHONE_KEY, clientPhone)
}

export function setUserTokens({
  userId,
  userPhone,
  userToken,
  userExpiresIn = 60 * 60 * 24 * 30,
}) {
  const expiresDate = new Date().getTime() + userExpiresIn * 1000
  localStorage.setItem(USER_ID_KEY, userId)
  localStorage.setItem(USER_TOKEN_KEY, userToken)
  localStorage.setItem(USER_EXPIRES_KEY, expiresDate)
  localStorage.setItem(USER_PHONE_KEY, userPhone)
}

export function removeClientAuthData() {
  localStorage.removeItem(CLIENT_ID_KEY)
  localStorage.removeItem(CLIENT_TOKEN_KEY)
  localStorage.removeItem(CLIENT_EXPIRES_KEY)
  localStorage.removeItem(CLIENT_PHONE_KEY)
}

export function removeUserAuthData() {
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_TOKEN_KEY)
  localStorage.removeItem(USER_EXPIRES_KEY)
  localStorage.removeItem(USER_PHONE_KEY)
}

export function getClientAccessToken() {
  return localStorage.getItem(CLIENT_TOKEN_KEY)
}

export function getUserAccessToken() {
  return localStorage.getItem(USER_TOKEN_KEY)
}

export function getClientExpiresDate() {
  return localStorage.getItem(CLIENT_EXPIRES_KEY)
}

export function getUserExpiresDate() {
  return localStorage.getItem(USER_EXPIRES_KEY)
}

export function getClientId() {
  return localStorage.getItem(CLIENT_ID_KEY)
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY)
}

export function getClientPhone() {
  return localStorage.getItem(CLIENT_PHONE_KEY)
}

export function getUserPhone() {
  return localStorage.getItem(USER_PHONE_KEY)
}

export function setClientPhone(clientPhone) {
  localStorage.setItem(CLIENT_PHONE_KEY, clientPhone)
}

export function setUserPhone(userPhone) {
  localStorage.setItem(USER_PHONE_KEY, userPhone)
}

export function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY)
}

export function setLanguage(language) {
  localStorage.setItem(LANGUAGE_KEY, language)
}

const localStorageService = {
  setClientTokens,
  setUserTokens,
  removeClientAuthData,
  removeUserAuthData,
  getClientAccessToken,
  getUserAccessToken,
  getClientId,
  getUserId,
  getClientExpiresDate,
  getUserExpiresDate,
  getClientPhone,
  getUserPhone,
  setClientPhone,
  setUserPhone,
  getLanguage,
  setLanguage,
}

export default localStorageService
