
const electron = require('electron')
const path = require('path')

const { session, app } = electron

require('electron-debug')({ showDevTools: true })


app.on('ready', () => {
    session.defaultSession.loadExtension(path.resolve(__dirname, './vue-devtools')).then((name) => {
    }).catch((err) => {
        console.log('vue-devtools', err)
    })
})

require('./index')
