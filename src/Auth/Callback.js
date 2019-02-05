import { Component } from 'react'
import { setIdToken, setAccessToken } from 'utils/auth'

class Callback extends Component {
  componentDidMount() {
    setAccessToken()
    setIdToken()
    setTimeout(() => {
      window.location.href = '/'
    }, 200)
  }

  render() {
    return null
  }
}

export default Callback
