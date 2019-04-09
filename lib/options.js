const pm2 = require('pm2')
const wsSend = require('./util').wsSend

module.exports = function () {
  let pm2Options = {
    list: getlist,
    describe: describe
  }

  function getlist (ws, params) {
    pm2.connect(err => {
      if (err) {
        wsSend(ws, {
          errMsg: err.message
        })
        return process.exit(2)
      }
      pm2.list((err, processDescription) => {
        if (err) {
          wsSend(ws, {
            errMsg: err.message
          })
          return pm2.disconnect()
        }
        wsSend(ws, {
          data: processDescription
        })
      })
    })
  }

  function describe (ws, params) {
    pm2.connect(err => {
      if (err) {
        wsSend(ws, {
          errMsg: err.message
        })
        return process.exit(2)
      }
      pm2.describe(params.process || 'all', (err, processDescription) => {
        if (err) {
          wsSend(ws, {
            errMsg: err.message
          })
          return pm2.disconnect()
        }
        return wsSend(ws, {
          data: processDescription
        })
      })
    })
  }

  return pm2Options
}
