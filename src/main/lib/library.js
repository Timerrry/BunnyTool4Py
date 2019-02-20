import path from 'path'
import Q from 'q'
import fs from 'fs-extra'
import log from 'electron-log'
import { fromPairs, pick } from 'lodash'
import util from './util'

function list() {
	let deferred = Q.defer()

  let libraries = []
  util.searchFiles("**/library.properties", { cwd: getLibrariesPath(), absolute: true })
  .then(pathList => Q.all(pathList.map(p => {
    let d = Q.defer()
    readProperties(path.basename(path.dirname(p)))
    .then(library => libraries.push(library))
    .finally(() => d.resolve())
    return d.promise
  })))
  .then(() => deferred.resolve(libraries))
  .catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function install(name, src) {
  let deferred = Q.defer()
  log.debug(`library install ${name}`)

  let librariesPath = getLibrariesPath()
  let basename = path.basename(src, path.extname(src))
  util.uncompress(src, librariesPath, true)
  .then(
    () => util.moveFile(path.join(librariesPath, basename), path.join(librariesPath, name.replace(/ +/g, "_"))),
    err => util.rejectError(err, deferred),
    progress => deferred.notify(progress)
  )
  .then(() => readProperties(name))
  .then(library => deferred.resolve(library))
  .catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function remove(name) {
  let deferred = Q.defer()
	log.debug(`library remove ${name}`)

  util.removeFile(path.join(getLibrariesPath(), name.replace(/ +/g, "_")))
  .then(() => deferred.resolve())
  .catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function readProperties(name) {
  let deferred = Q.defer()

  let propertiesPath = path.join(getLibrariesPath(), name.replace(/ +/g, "_"), "library.properties")
  if(!fs.existsSync(propertiesPath)) {
    util.rejectError(false, deferred)
    return deferred.promise
  }

  util.readFile(propertiesPath)
  .then(content => {
    let matches = content.match(/^([^=]+)=(.*)$/gm)
    if(!matches || matches.length <= 0) {
      util.rejectError(false, deferred)
      return
    }

    let library = fromPairs(matches.map(match => match.split('=')))
    if(!library.name || !library.version) {
      util.rejectError(false, deferred)
      return
    }

    let examples = path.join(path.dirname(propertiesPath), "examples")
    if(fs.existsSync(examples)) {
      library.examples = examples
    }
    deferred.resolve(pick(library, ["name", "version", "examples"]))
  })

  return deferred.promise
}

function getLibrariesPath() {
  return path.join(util.getAppPath("appDocuments"), "libraries")
}

module.exports.list = list
module.exports.install = install
module.exports.remove = remove
