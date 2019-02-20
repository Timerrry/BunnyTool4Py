import path from 'path'
import Q from 'q'
import child_process from 'child_process'
import log from 'electron-log'
import util from './util'

let started = false

function start() {
  if(started) {
    return Q.resolve()
  }

  let deferred = Q.defer()
  let params = { port: "8989", wsport: "8990" }
  let args = ["--port", params.port, "--wsport", params.wsport]
  let dir = path.join(util.getAppPath("data"), "pxt")
  let child = child_process.fork(path.join(dir, "index.js"), args, { cwd: dir })
  log.debug(`fork ${dir}/index.js`)
  child.on("message", message => {
    log.debug(`child process on message: ${JSON.stringify(message)}`)
    if(message && message.type && message.type === "success") {
      let token = message.data
      let url = `http://localhost:${params.port}/#local_token=${token}&wsport=${params.wsport}`
      deferred.resolve(url)
    }
  })
  log.debug("return promise")

  started = true
  return deferred.promise
}

module.exports.start = start
