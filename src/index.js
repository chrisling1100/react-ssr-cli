import React from 'react'
import {render, hydrate} from 'react-dom'
import {Provider} from 'react-redux'
import Loadable from 'react-loadable'
import {Frontload} from 'react-frontload'
import {ConnectedRouter} from 'connected-react-router'
import createStore from './store/createStore'


import App from './containers/app'

const {store, history} = createStore()

const application = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Frontload noServerRender>
                <App/>
            </Frontload>
        </ConnectedRouter>
    </Provider>)

const root = document.querySelector('#root')

if (process.env.NODE_ENV === 'production') {
    Loadable.preloadReady().then(() => {
        hydrate(application, root)
    })
} else {
    render(application, root)
}
