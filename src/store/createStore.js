import {createStore, applyMiddleware, compose} from 'redux'
import {connectRouter, routerMiddleware} from 'connected-react-router'
import thunk from 'redux-thunk'
import {createBrowserHistory, createMemoryHistory} from 'history'
import rootReducers from './rootReducer'

export const isServer = !(typeof window !== 'undefined' && window.document && window.document.createElement)

export default (url = '/') => {
    const history = isServer ? createMemoryHistory({
        initialEntries: [url]
    }) : createBrowserHistory()
    const enchance = []

    if (process.env.NODE_ENV === 'development' && !isServer) {
        const devToolsExtension = window.devToolsExtension
        if (typeof devToolsExtension === 'fuction') {
            enchance.push(devToolsExtension())
        }
    }
    const middleWare = [thunk, routerMiddleware(history)]
    const composeEnhancers = compose(applyMiddleware(...middleWare), ...enchance)
    const initialState = !isServer ? window.__PRELOADED_STATE__ : {}
    if (!isServer) {
        delete window.__PRELOADED_STATE__
    }

    const store = createStore(connectRouter(history)(rootReducers), initialState, composeEnhancers)

    return {
        history,
        store
    }
}


