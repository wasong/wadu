import gql from 'graphql-tag'

import { loggedIn, reset } from 'utils/auth'
import { client as apollo } from 'utils/apollo'
import contentful from 'utils/contentful'

// ------------------------------------
// Constants
// ------------------------------------
const CHECK_START = 'CHECK_START'
const CHECK_END = 'CHECK_END'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

const RENEW_SESSION_START = 'RENEW_SESSION_START'
const RENEW_SESSION_END = 'RENEW_SESSION_END'

const UPDATE_ME_SUCCESS = 'UPDATE_ME_SUCCESS'
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'

const SAVE_SIGNUP_SUCCESS = 'SAVE_SIGNUP_SUCCESS'

const initialState = {
  renewSessionPromise: null,

  checking: false,
  checked: false,

  loggedIn: false,

  user: {
    verified: false,
  },

  signup: {
    name: '',
    email: '',
    password: '',
    terms: false,
  },
}

// ------------------------------------
// Actions
// ------------------------------------

// Login
export const loginSuccess = user => ({
  type: LOGIN_SUCCESS,
  user,
})

// Logout
export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
})

export const logout = () => async (dispatch) => {
  reset()

  return dispatch(logoutSuccess())
}

// Authenticate
export const checkStart = () => ({
  type: CHECK_START,
})

export const checkEnd = () => ({
  type: CHECK_END,
})

export const authenticate = () => async (dispatch) => {
  dispatch(checkStart())

  if (loggedIn()) {
    try {
      // const { data: { me } } = await apollo.query({
      //   query: gql`
      //     query me {
      //       me { name email avatar verified }
      //     }
      //   `,
      // })

      dispatch(loginSuccess({}))
    } catch (err) {
      console.error(err)
      dispatch(logout())
    }
  }

  return dispatch(checkEnd())
}

export const getMe = () => async (dispatch) => {
  try {
    // const { data: { me } } = await apollo.query({
    //   query: gql`
    //     query me {
    //       me {
    //         name
    //         email
    //         avatar
    //         verified
    //       }
    //     }
    //   `,
    // })

    return dispatch(loginSuccess({}))
  } catch (err) {
    return dispatch(logout())
  }
}

// Change password
export const changePasswordSuccess = () => ({
  type: CHANGE_PASSWORD_SUCCESS,
})

export const changePassword = (password, newPassword) => async (dispatch) => {
  const { data: { changePassword: { error } } } = await apollo.mutate({
    mutation: gql`
      mutation changePassword($password: String!, $newPassword: String!) {
        changePassword(password: $password, newPassword: $newPassword) {
          error {
            code
          }
        }
      }
    `,
    variables: { password, newPassword },
  })

  if (error) throw new Error(error.code)

  return dispatch(changePasswordSuccess())
}

// Me
export const updateMeSuccess = user => ({
  type: UPDATE_ME_SUCCESS,
  user,
})

export const updateMe = ({ name, agency, avatar }) => async (dispatch) => {
  const { key, url } = avatar
  const input = key ? { name, agency: agency.id, avatar: key } : { name, agency: agency.id }
  const { data: { updateMe: { error } } } = await apollo.mutate({
    mutation: gql`
    mutation updateMe($input: MeUpdateInput!) {
      updateMe(input: $input) {
        error { code }
      }
    }
    `,
    variables: { input },
  })
  if (error) throw new Error(error.code)

  if (!url) {
    const { data: { removeAvatar: { error2 } } } = await apollo.mutate({
      mutation: gql`
      mutation removeAvatar {
        removeAvatar {
          error { code }
        }
      }
      `,
    })
    if (error2) throw new Error(error2.code)
  }

  return dispatch(updateMeSuccess({ name, agency, avatar }))
}

// Renew Session
const renewSessionStart = promise => ({
  type: RENEW_SESSION_START,
  promise,
})

const renewSessionEnd = () => ({
  type: RENEW_SESSION_END,
})

const saveSignupSuccess = signup => ({
  type: SAVE_SIGNUP_SUCCESS,
  signup,
})

const saveSignup = signup => dispatch => dispatch(saveSignupSuccess(signup))

export const actions = {
  authenticate,
  logout,
  renewSessionStart,
  renewSessionEnd,
  updateMe,
  getMe,
  changePassword,
  saveSignup,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_SUCCESS]: (state, { user }) => ({
    ...state,
    loggedIn: true,
    user,
  }),
  [LOGOUT_SUCCESS]: state => ({
    ...state,
    loggedIn: false,
    user: {},
  }),

  [CHECK_START]: state => ({
    ...state,
    checking: true,
    checked: false,
  }),
  [CHECK_END]: state => ({
    ...state,
    checking: false,
    checked: true,
  }),

  [RENEW_SESSION_START]: (state, { promise }) => ({
    ...state,
    renewSessionPromise: promise,
  }),
  [RENEW_SESSION_END]: state => ({
    ...state,
    renewSessionPromise: null,
  }),

  [UPDATE_ME_SUCCESS]: (state, { user }) => ({
    ...state,
    user: {
      ...state.user,
      ...user,
    },
  }),
  [SAVE_SIGNUP_SUCCESS]: (state, { signup }) => ({
    ...state,
    signup,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
