import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

/**
 * only allow routing if allowed === true
 *
 * @param {bool} allowed true or false to allow routing
 * @param {string} redirect go to this path if allowed is false
 * @param {node} component normal component prop of react-router-dom/Route
 */
const ProtectedRoute = ({
  allowed, redirect, component: Component, ...props,
}) => (
  <Route
    {...props}
    render={routeProps => (
      allowed
        ? <Component {...routeProps} />
        : <Redirect to={redirect} />
    )}
  />
)

ProtectedRoute.propTypes = {
  allowed: PropTypes.bool,
  redirect: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
}
ProtectedRoute.defaultProps = {
  allowed: false,
  redirect: '',
  component: null,
}

export default ProtectedRoute
