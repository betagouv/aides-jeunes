import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const middlewares = [ thunk ]

export default createStore(
  reducers,
  applyMiddleware(...middlewares)
)
