import React from 'react'
import { render } from 'react-dom'
import { setConfig } from 'react-hot-loader'

import App from './App'
import './styles/app.css'

console.log(`🤖 Version: ${process.env.VERSION}`)

// TODO: might delete later as not needed
setConfig({
  ignoreSFC: true, // RHL will be __completely__ disabled for SFC
  pureRender: true, // RHL will not change render method
})

const mount = document.getElementById('root')

render(<App />, mount)
