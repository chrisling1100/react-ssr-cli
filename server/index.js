const md5file = require('md5-file')
const path = require('path')
const ignoreStyles = require('ignore-styles')

const ignoreStyle = ignoreStyles.default

const imgExtension = ['.jpg', '.jepg', '.png', '.svg', '.gif']

ignoreStyle(ignoreStyles.DEFAULT_EXTENSIONS, (mod, filename) => {
    if (!imgExtension.find(f => filename.endsWith(f))) {
        return ignoreStyles.noOp()
    } else {
        const bash = md5file.sync(filename).slice(0, 8)
        const bn = path.baseName(filename).replace(/\.\w{3}$/, `.${bash}$1`)
        mod.exports = `/static/media/${bn}`
    }
})

require('babel-register')({
    ignore: /\/(build|node_modules)\//,
    presets: ['env', 'react-app'],
    plugins: [
        'syntax-dynamic-import',
        'dynamic-import-node',
        'react-loadable/babel'
    ]
});

require('./server')
