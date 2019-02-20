import path from 'path'
import Q from 'q'
import fs from 'fs-extra'
import log from 'electron-log'
import hasha from 'hasha'
import querystring from 'querystring'
import { uuid, getAppPath } from './util'

let downloadTasks = {}

function createTask(win, url, checksum) {
	let deferred = Q.defer()
	let taskId = uuid()
	downloadTasks[taskId] = { deferred }

	let query = querystring.stringify({checksum, taskId})
	win.webContents.session.once('will-download', onWillDownload)
	win.webContents.downloadURL(`${url}#${query}`)
	log.debug(`download ${url}`)

	return deferred.promise
}

function cancelTask(taskId) {
	log.debug(`cancel download ${taskId}`)
	let task = downloadTasks[taskId]
	task && task.downloadItem && task.downloadItem.cancel()
}

function onWillDownload(e, item, webContent) {
	let url = item.getURL()
	let pos = url.lastIndexOf("#")
	let query = querystring.parse(url.substring(pos + 1))
	url = url.substring(0, pos)

	let taskId = query.taskId
	let task = downloadTasks[taskId]
	task.downloadItem = item

	let savePath = path.join(getAppPath("appData"), 'download', item.getFilename())
	if(check(savePath, query.checksum)) {
		item.cancel()
		log.debug(`download cancel, ${url} has cache`)
		handleTask(taskId, true, savePath)
		return
	}

	item.setSavePath(savePath)

	let total = item.getTotalBytes() || 1024 * 1024 * 1024
	item.on('updated', (evt, state) => {
		if(state == "interrupted") {
			log.debug(`download interrupted: ${url}`)
			handleTask(taskId, false)
		} else if(state === 'progressing') {
			if(item.isPaused()) {
				log.debug(`download paused: ${url}`)
				handleTask(taskId, false)
			} else {
				let transferred = item.getReceivedBytes()
				let percent = transferred / total
				percent = percent > 1 ? 1 : percent
				handleTask(taskId, "notify", { taskId, percent, total, transferred })
			}
		}
	})

	item.once('done', (evt, state) => {
		if(state == "completed") {
			log.debug(`download success: ${url}, at ${savePath}`)
			handleTask(taskId, true, savePath)
		} else {
			log.debug(`download fail: ${url}`)
			handleTask(taskId, false)
		}
	})
}

function handleTask(taskId, type, ...args) {
	let task = downloadTasks[taskId]
	if(!task || !task.deferred) {
		return
	}

	let deferred = task.deferred
	let callback
	if(type === "notify") {
		callback = deferred.notify
	} else {
		delete downloadTasks[taskId]
		callback = type ? deferred.resolve : deferred.reject
	}
	callback.apply(this, args)
}

function check(filePath, checksum) {
	if(!checksum || !fs.existsSync(filePath)) {
		return false
	}

	let pos = checksum.indexOf(":")
	let algorithm = checksum.substring(0, pos).replace("-", "").toLowerCase()
	return checksum.substring(pos + 1) === hasha.fromFileSync(filePath, {algorithm: algorithm})
}

module.exports.createTask = createTask
module.exports.cancelTask = cancelTask
