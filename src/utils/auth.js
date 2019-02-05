import Auth0 from 'auth0-js'
import decode from 'jwt-decode'

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'

const createAuth0Authentication = () => (
  new Auth0.WebAuth({
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN,
    redirectUri: process.env.AUTH0_REDIRECT_URI,
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    scope: 'read:current_user update:current_user_metadata app_metadata',
    responseType: 'token id_token',
  })
)

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY)
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken)
  if (!token.exp) return null

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token)

  return expirationDate < new Date()
}

export const login = (username, password) => new Promise((resolve, reject) => {
  const auth0 = createAuth0Authentication()
  auth0.login({
    realm: 'Username-Password-Authentication',
    username,
    password,
  }, (err) => {
    if (err) {
      reject(new Error(err.description))
    }
    resolve()
  })
})

export const signup = user => new Promise((resolve, reject) => {
  const auth0 = createAuth0Authentication()
  auth0.redirect.signupAndLogin({
    connection: 'Username-Password-Authentication',
    email: user.email,
    password: user.password,
    user_metadata: { name: user.name, phone: user.phone },
  }, (err) => {
    if (err.name === 'PasswordStrengthError') reject(new Error('Your password is too weak'))
    if (err) reject(new Error(err.description))
    resolve()
  })
})

export const changePassword = email => new Promise((resolve, reject) => {
  const auth0 = createAuth0Authentication()
  auth0.changePassword({
    connection: 'Username-Password-Authentication',
    email,
  }, (err) => {
    if (err) reject(new Error(err.description))
    resolve()
  })
})

export const getIdToken = () => { // eslint-disable-line
  return localStorage.getItem(ID_TOKEN_KEY) === null || localStorage.getItem(ID_TOKEN_KEY) === 'null'
    ? localStorage.removeItem(ID_TOKEN_KEY)
    : localStorage.getItem(ID_TOKEN_KEY)
}

export const reset = () => {
  clearIdToken()
  clearAccessToken()
}

export const loggedIn = () => {
  const idToken = getIdToken()

  return !!idToken && !isTokenExpired(idToken)
}

export const loggedInAndExpired = () => {
  const idToken = getIdToken()

  return !!idToken && isTokenExpired(idToken)
}

export const refreshToken = () => new Promise((resolve, reject) => {
  const auth0 = createAuth0Authentication()
  auth0.checkSession({}, (err, session) => {
    if (err) {
      console.log(err)
      reject()
    } else {
      localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
      localStorage.setItem(ID_TOKEN_KEY, session.idToken)
      resolve()
    }
  })
})

export const requireAuth = (nextState, replace) => {
  if (!loggedIn()) {
    replace({ pathname: '/' })
  }
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  const match = RegExp(`[#&]${name}=([^&]*)`).exec(window.location.hash)

  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

// Get and store access_token in local storage
export function setAccessToken() {
  const accessToken = getParameterByName('access_token')
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

// Get and store id_token in local storage
export function setIdToken() {
  const idToken = getParameterByName('id_token')
  localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export default {}
