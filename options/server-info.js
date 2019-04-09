const os = require('os')

module.exports = function () {
  let cpuLoadavgs = _getCPULoadavgs()
  let cpuUtilization = _getCPUUtilization()
  let serverInfo = {
    cpuLoadavgs: cpuLoadavgs,
    cpuUtilization: cpuUtilization
  }
  return serverInfo
}

function _getCPULoadavgs () {
  // cpu核心数
  const length = os.cpus().length
  // 单核CPU的平均负载
  return os.loadavg().map(load => load / length)
}

async function _getCPUUtilization () {
  try {
    let cpuMetrics = await _cpuMetrics()
    return cpuMetrics
  } catch (err) {
    return {}
  }
}

function _instantaneousCpuTime () {
  let idleCpu = 0
  let tickCpu = 0
  const cpus = os.cpus()
  const length = cpus.length

  let i = 0
  while (i < length) {
    let cpu = cpus[i]

    for (let type in cpu.times) {
      tickCpu += cpu.times[type]
    }

    idleCpu += cpu.times.idle
    i++
  }

  const time = {
    idle: idleCpu / cpus.length, // 单核CPU的空闲时间
    tick: tickCpu / cpus.length // 单核CPU的总时间
  }
  return time
}

function _cpuMetrics () {
  const startQuantize = _instantaneousCpuTime()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const endQuantize = _instantaneousCpuTime()
      const idleDifference = endQuantize.idle - startQuantize.idle
      const tickDifference = endQuantize.tick - startQuantize.tick
      resolve(1 - (idleDifference / tickDifference))
    }, 1000)
  })
}
