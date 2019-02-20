import path from 'path'
import Q from 'q'
import semver from 'semver'
import { map, groupBy, orderBy } from 'lodash'
import log from 'electron-log';
import util from './util'

function loadBoards() {
  return util.readJson(path.join(util.getAppPath("data"), "config", "boards.json"))
}

function loadLibraries() {
  let deferred = Q.defer()
  util.readJson(path.join(util.getAppPath("data"), "config", "libraries.json"))
  .then(result => deferred.resolve(map(groupBy(orderBy(result.libraries, ["name", "version"], ['asc', 'desc']), "name"), (value, key) => ({name: key, list: value, installed: false, canUpdate: false, version: "", examples: ""}))))
  .catch(err => util.rejectError(err, deferred))

  return deferred.promise
}

function loadExamples() {
  let deferred = Q.defer()

  let examplesPath = path.join(util.getAppPath("data"), "config", "examples")
  util.readJson(path.join(examplesPath, "examples.json"))
  .then(examples => deferred.resolve(examples.map(example => ({...example, path: path.join(examplesPath, example.path)}))))
  .catch(err => util.rejectError(err, deferred))

  return deferred.promise
}

function loadSetting() {
  return util.readJson(path.join(util.getAppPath("appData"), "setting"))
}

function saveSetting(setting) {
  return util.writeJson(path.join(util.getAppPath("appData"), "setting"), setting)
}

function loadPackageBoards(pkgPath) {
  let boards = []
  let boardsPath = path.join(pkgPath, "boards")

  return util.searchFiles("**/config.json", { cwd: boardsPath, absolute: true })
  .then(pathList => Q.all(pathList.map(boardPath => {
    return util.readJson(boardPath)
    .then(board => boards.push({
      ...board,
      img: path.join(path.dirname(boardPath), board.img).replace(/\\/g, '/'),
      src: board.src ? path.join(path.dirname(boardPath), board.src).replace(/\\/g, '/') : null,
    }))
    .catch(err => log.error(err))
  })))
  .then(() => boards)
}

function loadPackageComponents(pkgPath) {
  let components = []
  let componentsPath = path.join(pkgPath, "components")

  return util.searchFiles("**/config.json", { cwd: componentsPath, absolute: true })
  .then(pathList => Q.all(pathList.map(componentPath => {
    return util.readJson(componentPath)
    .then(component => components.push({
      ...component,
      analogImg: path.join(path.dirname(componentPath), component.analogImg).replace(/\\/g, '/'),
      physicalImg: path.join(path.dirname(componentPath), component.physicalImg).replace(/\\/g, '/'),
      src: component.src ? path.join(path.dirname(componentPath), component.src).replace(/\\/g, '/') : null,
    }))
    .catch(err => log.error(err))
  })))
  .then(() => components)
}

function loadPackages() {
  let packages = []
  let packagesPath = path.join(util.getAppPath("data"), "packages")
  return util.searchFiles("**/package.json", { cwd: packagesPath, absolute: true })
  .then(pathList => Q.all(pathList.map(p => {
    let pkgPath = path.dirname(p)
    return Q.all([
      util.readJson(p),
      loadPackageBoards(pkgPath),
      loadPackageComponents(pkgPath)
    ])
    .then(result => {
      let [pkg, boards, components] = result;
      packages.push({
        ...pkg,
        boards,
        components,
        blockly: (pkg.blockly || []).map(b => path.join(pkgPath, b).replace(/\\/g, '/')),
      })
    })
    .catch(() => log.error(err))
  })))
  .then(() => packages)
}

function loadPackages2() {
  let deferred = Q.defer()

  let packages = []
  let packagesPath = path.join(util.getAppPath("data"), "packages")
  util.searchFiles("**/package.json", { cwd: packagesPath, absolute: true })
  .then(pathList => Q.all(pathList.map(p => {
    let d = Q.defer()
    util.readJson(p).then(pkg => {
      let pkgPath = path.dirname(p)
      pkg = {
        ...pkg,
        path: pkgPath,
        boards: pkg.boards.map(board => ({
          ...board,
          img: path.join(pkgPath, board.img).replace(/\\/g, '/'),
        })),
        components: pkg.components.map(component => ({
          ...component,
          analogImg: path.join(pkgPath, component.analogImg).replace(/\\/g, '/'),
          physicalImg: path.join(pkgPath, component.physicalImg).replace(/\\/g, '/'),
        })),
        blockly: (pkg.blockly || []).map(b => path.join(pkgPath, b).replace(/\\/g, '/')),
      }
      packages.push(pkg)
    })
    .finally(() => d.resolve())
    return d.promise
  })))
  .then(() => deferred.resolve(packages))
  .catch(err => util.rejectError(err, deferred))

  return deferred.promise
}

module.exports.loadBoards = loadBoards
module.exports.loadLibraries = loadLibraries
module.exports.loadExamples = loadExamples
module.exports.loadSetting = loadSetting
module.exports.saveSetting = saveSetting
module.exports.loadPackages = loadPackages
