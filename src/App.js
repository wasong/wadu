import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import store from 'utils/store'
import muiTheme from './styles/muiTheme'
import { authenticate } from './app.module'

import Routes from './routes'

class App extends Component {
  componentDidMount = () => {
    store.dispatch(authenticate())
  }

  render() {
    return (
      <ThemeProvider theme={muiTheme}>
        <Provider store={store}>
          <div>
            <CssBaseline />
            <Helmet
              titleTemplate="%s | Wadu"
              meta={[
                { charset: 'utf-8' },
                {
                  'http-equiv': 'X-UA-Compatible',
                  content: 'IE=edge',
                },
                {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
                },
              ]}
            />
            <Routes />
          </div>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default hot(App)
