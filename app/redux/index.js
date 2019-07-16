import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const middlewares = [ thunk ]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
  applyMiddleware(...middlewares)
)

export const create = (...otherMiddlewares) => {

	const allMiddlewares = [
    ...middlewares,
    ...otherMiddlewares
  ]

	return createStore(reducers, composeEnhancers(applyMiddleware(...allMiddlewares)))
}
