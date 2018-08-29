import path from 'path'
import fs from 'fs'

import React from 'react'
import {renderToString} from 'react-dom/server'
import Helmet from 'react-helmet'
import {Provider} from 'react-redux'
import {StaticRouter} from 'react-router'
import {Frontload, frontloadServerRender} from 'react-frontload'
import Loadable from 'react-loadable'
import createStore from '../src/store/createStore'

import App from '../src/containers/app'
import mainfest from '../build/manifest'
import {setRouteChecked} from '../src/store/auth/index'

const injectHtml = (data, {html, title, meta, body, scripts, state}) => {
    data = data.replace('<html>', `<html ${html}>`);
    data = data.replace(/<title>.*?<\/title>/g, title);
    data = data.replace('</head>', `${meta}</head>`);
    data = data.replace(
        '<div id="root"></div>',
        `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>`
    );
    data = data.replace('</body>', scripts.join('') + '</body>');

    return data;
}

export default  (req, res) => {
    fs.readFile(path.resolve(__dirname, '../build/index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('read error')
            return res.status(404).end()
        }
        const {store} = createStore(req.url)

        if ('checked' in req.cookies) {
            store.dispatch(setRouteChecked(req.url))
        } else {
            console.log(' store.dispatch(setRouteChecked(req.url))', req.url)
            store.dispatch(setRouteChecked(req.url))
        }
        let modules = []
        let context = {}
        frontloadServerRender(() => renderToString(
            <Loadable.Capture report={m => modules.push(m)}>
                <Provider store={store}>
                    <StaticRouter location={req.url} context={context}>
                        <Frontload isServer>
                            <App/>
                        </Frontload>
                    </StaticRouter>
                </Provider>
            </Loadable.Capture>
        )).then(routerMarkUp => {
            if (context.url) {
                res.writeHead(302, {
                    location: context.url
                })
                res.end()
            } else {
                const extractAssets = (assets, chunks) => Object.keys(assets)
                    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
                    .map(k => assets[k])

                const extractChunks = extractAssets(mainfest, modules)
                    .map(c => `<script src="/${c}"></script>`)
                const helmet = Helmet.renderStatic()
                console.log('Header Title', helmet.title.toString())
                const html = injectHtml(data, {
                    html: helmet.htmlAttributes.toString(),
                    title: helmet.title.toString(),
                    meta: helmet.meta.toString(),
                    body: routerMarkUp,
                    scripts: extractChunks,
                    state: JSON.stringify(store.getState()).replace(/</g, '\\u003c')
                })
                res.send(html)
            }
        })
    })
}
