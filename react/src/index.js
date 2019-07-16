import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import { create } from '../../app/redux'

const store = create()

render(
  <Provider store={ store }>
    <App />
  </Provider>, document.getElementById('app'))
