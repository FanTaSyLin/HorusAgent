const fs = require('fs')

module.exports = Util

function Util () { }

Util.wsSend = function (ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message))
  } else {
    ws.close()
  }
}

/**
 * 读取JSON文件 并返回字符串
 * @param {string} filename 文件名
 * @return {string}
 */
Util.readJSON = function (filename) {
  /* 读文件 */
  var bin = fs.readFileSync(filename)
  if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
    bin = bin.slice(3)
  }
  return bin.toString('utf-8')
}
