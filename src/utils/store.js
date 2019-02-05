import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { loggedInAndExpired, refreshToken } from 'utils/auth'

import app, { actions } from '../app.module'

const analytics = () => next => (action) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: action.type,
    payload: action.payload,
  })

  return next(action)
}

const renewSession = async (dispatch) => {
  const promise = refreshToken()
  dispatch(actions.renewSessionStart(promise))

  // try {
  //   await promise
  //
  //   return dispatch(actions.renewSessionEnd())
  // } catch (err) {
  //   console.log(err)
  // }

  dispatch(actions.renewSessionEnd())

  return promise
}

const auth = ({ dispatch, getState }) => next => async (action) => {
  if (typeof action === 'function') {
    const state = getState()
    if (state) {
      const { renewSessionPromise } = state.app

      if (loggedInAndExpired()) {
        try {
          if (!renewSessionPromise) {
            await renewSession(dispatch, state)
          } else {
            await renewSessionPromise
          }
        } catch (err) {
          console.error(err)
          dispatch(actions.logout())
        }
      }
    }
  }

  return next(action)
}

// Redux store config
const configureStore = (initialState = {}) => {
  const reducers = combineReducers({
    app,
  })

  // Middleware and store enhancers
  const middlewares = [
    auth,
    thunk,
    process.env.NODE_ENV !== 'production' && logger,
    analytics,
  ].filter(Boolean)
  const enhancer = compose(applyMiddleware(...middlewares))
  const store = createStore(reducers, initialState, enhancer)

  return store
}

const store = configureStore()

export default store
