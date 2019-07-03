import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const middlewares = [ thunk ]

export default createStore(
  reducers,
  applyMiddleware(...middlewares)
)

export const create = (...otherMiddlewares) => {

	const allMiddlewares = [
    ...middlewares,
    ...otherMiddlewares
  ]

	return createStore(reducers, applyMiddleware(...allMiddlewares))
}
