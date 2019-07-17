import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Popup from './components/Popup/Popup.jsx'
import Options from './components/Options/Options.jsx'

if (window.innerWidth < 1000) {
  ReactDOM.render(<Popup />, document.getElementById('root'))
} else {
  ReactDOM.render(<Options />, document.getElementById('root'))
}