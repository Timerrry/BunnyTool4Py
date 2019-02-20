import { app, BrowserWindow, shell, clipboard } from 'electron'

import path from 'path'

import is from 'electron-is'
import log from 'electron-log'
import Q from 'q'
import commandLineArgs from 'command-line-args' //命令行参数解析
import terminate from 'terminate'

import util, { listenMessage } from './lib/util'
import serialPort from './lib/serialPort'
import arduino from './lib/arduino'
import config from './lib/config'
import menu from './lib/menu'
import download from './lib/download'
import library from './lib/library'
import { convert } from './lib/convert'
// import pxt from './lib/pxt'

const DEV = process.env.NODE_ENV === "development"
const DEBUG = process.env.DEBUG_PROD === "true"

const MIN_WIDTH = 1200;
const MIN_HEIGHT = 720;

const optionDefinitions = [
	{ name: 'debug-brk', type: Number, defaultValue: false },
	{ name: 'fullscreen', alias: 'f', type: Boolean, defaultValue: false},
	{ name: 'maximize', alias: 'm', type: Boolean, defaultValue: false},
]

let args = commandLineArgs(optionDefinitions, {argv: process.argv.slice(1), partial: true}) //命令行参数

let mainWindow = null
let lockSize = false
let helpWindow = null

init()

/**
 * 初始化
 */
function init() {
	process.on('uncaughtException', err => {
		let stack = err.stack || `${err.name}: ${err.message}`
		log.error(`unhandledRejection: stack\n${stack}`)
		!DEV && !DEBUG && app.quit()
	})
	process.on('unhandledRejection', (reason, p) => {
		log.error(`unhandledRejection: reason\n${reason}`)
		!DEV && !DEBUG && app.quit()
	});

	if(DEBUG) {
		require('source-map-support').install() // eslint-disable-line global-require
	}

	if (DEV || DEBUG) {
		require('electron-debug')({enabled: true, showDevTools: "undocked"}) // eslint-disable-line global-require
	}

	initLog()

	if(app.makeSingleInstance(argv => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()
		}
	})) {
		app.quit()
	}

	listenEvents()
	listenMessages()

	log.debug(`app ${app.getName()} start, version ${util.getVersion()}`)
}

function initLog() {
	if(DEV) {
		log.transports.console.level = "debug"
		log.transports.file = false
	} else if(DEBUG) {
		log.transports.console.level = "debug"
		log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
		log.transports.file.level = 'debug'
	} else {
		//非debug模式，禁用控制台输出
		log.transports.console = false
		log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
		log.transports.file.level = 'error'
	}
}

/**
 * 监听事件
 */
function listenEvents() {
	app.on('ready', onAppReady)
	.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
	.on('activate', () => mainWindow === null && createWindow())
	.on('before-quit', onAppBeforeQuit)
	.on('will-quit', onAppWillQuit)
	.on('quit', () => log.debug('app quit'))

	is.macOS() && app.on('open-file', e => e.preventDefault())
}

/**
 * 监听消息
 */
function listenMessages() {
	listenMessage("app.getMeta", () => Q.resolve(util.getMeta()))
	listenMessage("app.getAppPath", (name) => Q.resolve(util.getAppPath(name)))
	listenMessage("app.log", (text, level = "debug") => log[level](text))
	listenMessage("app.error", onAppError)
	listenMessage("app.copy", (text, type) => clipboard.writeText(text, type))
	listenMessage("app.quit", () => app.quit())
	listenMessage("app.exit", () => onAppWillQuit() && terminate(process.pid))
	listenMessage("app.reload", () => mainWindow && mainWindow.reload())
	listenMessage("app.relaunch", () => onAppRelaunch())
	listenMessage("app.fullscreen", () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()))
	listenMessage("app.min", () => mainWindow && mainWindow.minimize())
	listenMessage("app.max", onAppToggleMax)
	listenMessage("app.lockSize", onAppLockSize)
	listenMessage("app.unlockSize", onAppUnlockSize)
	listenMessage("app.hide", () => mainWindow && mainWindow.hide())
	listenMessage("app.show", () => mainWindow && mainWindow.show())
	listenMessage("app.showOpenDialog", util.showOpenDialog)
	listenMessage("app.showSaveDialog", util.showSaveDialog)
	listenMessage("app.showItemInFolder", filePath => Q.resolve(shell.showItemInFolder(path.normalize(filePath))))
	listenMessage("app.execCommand", util.execCommand)
	listenMessage("app.spawnCommand", util.spawnCommand)
	listenMessage("app.execFile", util.execFile)

	listenMessage("fs.read", util.readFile)
	listenMessage("fs.write", util.writeFile)
	listenMessage("fs.save", util.saveFile)
	listenMessage("fs.move", util.moveFile)
	listenMessage("fs.remove", util.removeFile)
	listenMessage("fs.readJson", util.readJson)
	listenMessage("fs.writeJson", util.writeJson)

	listenMessage("url.open", url => Q.resolve(url && shell.openExternal(url)))
	listenMessage("url.request", util.request)
	listenMessage("url.download", (url, checksum) => download.createTask(mainWindow, url, checksum))
	listenMessage("url.cancelDownload", download.cancelTask)

	listenMessage("serialPort.list", serialPort.list)
	listenMessage("serialPort.open", serialPort.open)
	listenMessage("serialPort.write", serialPort.write)
	listenMessage("serialPort.close", serialPort.close)
	listenMessage("serialPort.closeAll", serialPort.closeAll)
	listenMessage("serialPort.update", serialPort.update)
	listenMessage("serialPort.flush", serialPort.flush)
	listenMessage("serialPort.reset", serialPort.reset)
	listenMessage("serialPort.onChange", serialPort.onChange)

	listenMessage("arduino.build", arduino.build)
	listenMessage("arduino.upload", arduino.upload)
	listenMessage("arduino.list", arduino.list)

	listenMessage("arduino.python_ls", arduino.python_ls)
	listenMessage("arduino.put", arduino.python_put)
	listenMessage("arduino.get", arduino.python_get)
	listenMessage("arduino.rm", arduino.python_rm)
	listenMessage("arduino.run", arduino.python_run)

	listenMessage("library.list", library.list)
	listenMessage("library.install", library.install)
	listenMessage("library.remove", library.remove)

	// listenMessage("pxt.start", pxt.start)

	listenMessage("config.loadBoards", config.loadBoards)
	listenMessage("config.loadLibraries", config.loadLibraries)
	listenMessage("config.loadExamples", config.loadExamples)
	listenMessage("config.loadSetting", config.loadSetting)
	listenMessage("config.saveSetting", config.saveSetting)
	listenMessage("config.loadPackages", config.loadPackages)

	listenMessage("editor.formatCode", util.formatCode)

	listenMessage("blockly.openHelpUrl", url => Q.resolve(url && createHelpWindow(url)))

	listenMessage("converter.convert", convert)
}

function onAppReady() {
	log.debug('app ready')

	createWindow()
	is.macOS() && menu.setup()
	serialPort.toggleMonitor(true)
}

/**
 * 创建窗口
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		width: MIN_WIDTH,
		height: MIN_HEIGHT,
		minWidth: MIN_WIDTH,
		minHeight: MIN_HEIGHT,
		frame: false,
		show: false,
	})
	// 禁用菜单
	mainWindow.setMenu(null)

	if(args.fullscreen) {
		mainWindow.setFullScreen(true)
	} else if(args.maximize) {
		mainWindow.maximize()
	}

	mainWindow.on('closed', () => (mainWindow = null))
		// .once('ready-to-show', () => mainWindow && mainWindow.show())
		.on('enter-full-screen', () => util.postMessage("app.onFullscreenChange", true))
		.on('leave-full-screen', () => util.postMessage("app.onFullscreenChange", false))

	is.windows() && mainWindow.on("unmaximize", () => {
		setTimeout(() => {
			const bounds = mainWindow.getBounds()
			bounds.width += 1
			mainWindow.setBounds(bounds)
			bounds.width -= 1
			mainWindow.setBounds(bounds)
		}, 5)
	})

	mainWindow.webContents.on('will-navigate', e => e.preventDefault())
	mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)
	mainWindow.focus()
}

function onAppBeforeQuit(e) {
	e.preventDefault()
	util.postMessage("app.onBeforeQuit")
}

function onAppWillQuit() {
	util.removeFile(path.join(util.getAppPath("appData"), "temp"), true)
	serialPort.closeAll()
	serialPort.toggleMonitor(false)
	return true
}

function onAppToggleMax(value) {
	if(!mainWindow) {
		return
	}

	mainWindow.isFullScreen() && mainWindow.setFullScreen(false)
	if(value === undefined) {
		mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
	} else {
		value ? mainWindow.maximize() : mainWindow.unmaximize()
	}
}

function onAppLockSize(width, height) {
	if(!mainWindow) {
		return
	}

	mainWindow.setFullScreenable(false)
	mainWindow.setMaximizable(false)
	mainWindow.setMaximumSize(width, height)
	mainWindow.setMinimumSize(width, height)
	mainWindow.setSize(width, height)
	mainWindow.setResizable(false)
	mainWindow.center()
	lockSize = true
}

function onAppUnlockSize() {
	if(!mainWindow || !lockSize) {
		return
	}

	mainWindow.setResizable(true)
	mainWindow.setMaximumSize(9999, 9999);
	mainWindow.setMinimumSize(MIN_WIDTH, MIN_HEIGHT)
	mainWindow.setSize(MIN_WIDTH, MIN_HEIGHT)
	mainWindow.setMaximizable(true)
	mainWindow.setFullScreenable(true)
	mainWindow.center()
	lockSize = false
}

function onAppRelaunch() {
	app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
	app.exit(0)
}

function onAppError(message) {
	log.error(`${message}`)
}

function createHelpWindow(url) {
	helpWindow = new BrowserWindow({width: 1200, height: 720})
  helpWindow.on('closed', () => {
    helpWindow = null
	})
	// 警用菜单栏
	helpWindow.setMenu(null)
  // 加载远程URL
  helpWindow.loadURL(url)
}