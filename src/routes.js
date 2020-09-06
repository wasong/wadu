import React from 'react'
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'
import { connect } from 'react-redux'
import Loadable from 'react-loadable'
import { TestComponent } from '@staccc/ui'

import Callback from './Auth/Callback'

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "split" */ './Dashboard'),
  loading: () => <div>Loading Dashboard</div>,
})

const Yikes = () => <div><TestComponent /></div>

const Routes = ({ loggedIn, checked }) => {
  if (!checked) return null

  return (
    <Router>
      <div>
        {loggedIn
          ? (
            <Switch>
              <Route path="/callback" component={Callback} />
              <Route path="/" component={Dashboard} />
              <Redirect to="/dashboard" />
            </Switch>
          )
          : (
            <Switch>
              <Route path="/callback" component={Callback} />
              <Route path="/" component={Yikes} />
              <Redirect to="/" />
            </Switch>
          )}
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  checked: state.app.checked,
  loggedIn: state.app.loggedIn,
})

export default connect(mapStateToProps)(Routes)
