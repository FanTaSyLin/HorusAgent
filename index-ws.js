const WebSocket = require('ws')
const configCtrl = require('./lib/config-ctrl.js')
const shkUtil = require('./lib/shk-util')

// =======================此处引入自己的处理函数======================
const agentStatus = require('./options/agent-status')
const pm2Desc = require('./options/pm2-describe')
const pm2List = require('./options/pm2-list')
const serverInfo = require('./options/server-info')
// =================================================================

const CONFIG = configCtrl(__dirname)
const WSPATH = '/horus'
const PORT = CONFIG['port']
const wss = new WebSocket.Server({ port: PORT, path: WSPATH }, () => {
  console.log('Horus Agent started, port: %s, path: %s', PORT, WSPATH)
})

wss.on('connection', ws => {
  ws.on('message', message => {
    let params = JSON.parse(message)
    let response = {}
    // =======================此处引入自己的处理函数======================
    switch (params.option) {
      case 'agent-status':
        response = agentStatus()
        break
      case 'pm2-list':
        response = pm2List()
        break
      case 'pm2-describe':
        response = pm2Desc(params.process)
        break
      case 'server-info':
        response = serverInfo()
        break
      default:
        response = {
          errMsg: new Error(`服务名错误: ${params.option}`)
        }
        break
    }
    // =================================================================
    shkUtil.wsSend(ws, response)
  })
  ws.on('close', () => {
    /* TODO */
  })
})
