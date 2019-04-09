const pm2 = require('pm2')

pm2.connect((err) => {
  if (err) {
    return process.exit(2)
  }
  pm2.start({
    script: './code-test/index.js',
    instances: 3,
    name: 'HorusAgent'
  }, (err, apps) => {
    pm2.disconnect()
    if (err) { throw err }
  })
})
