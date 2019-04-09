const pm2 = require('pm2')
module.exports = function (process) {
  pm2.connect(err => {
    if (err) {
      return {
        errMsg: err.message
      }
    }
    pm2.describe(process || 'all', (err, processDescription) => {
      if (err) {
        pm2.disconnect()
        return {
          errMsg: err.message
        }
      }
      pm2.disconnect()
      return {
        data: processDescription
      }
    })
  })
}
