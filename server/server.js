const express = require('express')
const bodyParse = require('body-parser')
const cookieParse = require('cookie-parser')
const morgan = require('morgan')
const compression = require('compression')
const loadable = require('react-loadable')
const path = require('path')
const app = new express()

const PORT = process.env.PORT || 3000
import loader from './loader'

app.use(compression())
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cookieParse())

app.use(express.Router().get('/', loader))
app.use(express.static(path.resolve(__dirname, '../build')))
app.use(loader)

loadable.preloadAll().then(() => {
    app.listen(PORT, () => {
        console.log(`this app was running at port ${PORT}`)
    })
})

app.on('error', (e) => {
    if (e.sysCall !== 'listen') {
        throw  e
    }

    const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`

    switch (e.code) {
        case "EACCES":
            console.error(bind + 'requires elevated privileges')
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(bind + 'is already used')
            process.exit(1)
            break
        default:
            throw e
            break
    }
})






