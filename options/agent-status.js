const pm2 = require('pm2')

module.exports = function () {
  pm2.connect(err => {
    if (err) {
      return {
        errMsg: err.message
      }
    }
    pm2.describe('HorusAgent', (err, processDescription) => {
      if (err) {
        pm2.disconnect()
        return {
          errMsg: err.message
        }
      }
      if (processDescription.length < 1) {
        pm2.disconnect()
        return {
          status: 'offline'
        }
      } else {
        let status = processDescription[0].pm2_env.status
        pm2.disconnect()
        return {
          status: status
        }
      }
    })
  })
}
