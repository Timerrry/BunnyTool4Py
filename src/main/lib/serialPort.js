import path from 'path'
import log from 'electron-log'
import Q from 'q'
import { postMessage } from './util'

import usbDetect from 'usb-detection'
import SerialPort from 'serialport'

const Delimiter = SerialPort.parsers.Delimiter

let connectedPorts = {
	autoPortId: 0,
	ports: {},
}

/**
 * 查询串口
 */
function list(onlyName) {
	let deferred = Q.defer()

  SerialPort.list()
    .then(ports => deferred.resolve(onlyName ? ports.map(p => p.comName) : ports))
    .catch(err => {
      log.error(err)
      deferred.reject(err)
    })

	return deferred.promise
}

/**
 * 打开串口
 * @param {*} comName 串口路径
 * @param {*} options 选项
 * @param {*} callbacks 回调
 */
function open(comName, options, callbacks) {
	var deferred = Q.defer()

	log.debug(`open SerialPort: ${comName}, options: ${JSON.stringify(options)}`)
	options.autoOpen = false
	options.parser = options.parser || "raw"
	options.flowingMode = options.flowingMode !== false

	var port = new SerialPort(comName, options)
	port.open(err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		var portId = ++connectedPorts.autoPortId
		connectedPorts.ports[portId] = port
		let handleError = callbacks && callbacks.onError || onError
		let handleClose = callbacks && callbacks.onClose || onClose
		let handleData = callbacks && callbacks.onData || onData

		var target = options.parser == "raw" ? port : port.pipe(new Delimiter({delimiter: Buffer.from(options.parser)}))
		if(options.flowingMode) {
			target.on('data', data => {
				handleData(portId, data)
			})
		} else {
			target.on('readable', () => {
				var data = target.read()
				handleData(portId, data)
			})
		}

		port.on('error', err => {
			handleError(portId, err)
		})
		port.on('close', () => {
			delete connectedPorts.ports[portId]
			handleClose(portId)
		})

		port.flush(() => {
			deferred.resolve(portId)
		})
	})

	return deferred.promise
}

/**
 * 串口发送
 * @param {*} portId 串口id
 * @param {*} content 发送内容，Buffer | String
 */
function write(portId, content) {
	var  deferred = Q.defer()

	// log.debug(`writeSerialPort: ${portId}, ${content}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.write(Buffer.from(content), err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		port.drain(() => {
			deferred.resolve()
		})
	})

	return deferred.promise
}

/**
 * 关闭串口
 * @param {*} portId 串口id
 */
function close(portId) {
	var  deferred = Q.defer()

	log.debug(`closeSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.close(() => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 关闭所有串口
 */
function closeAll() {
	log.debug(`closeAllSerialPort`)
	for(var key in connectedPorts.ports) {
		connectedPorts.ports[key].close()
	}
	connectedPorts.ports = {}
}

/**
 * 更新串口设置
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function update(portId, options) {
	var  deferred = Q.defer()

	log.debug(`updateSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.update(options, () => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 清空串口缓冲区
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function flush(portId, options) {
	var  deferred = Q.defer()

	// log.debug(`flushSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.flush(() => {
		deferred.resolve()
	})

	return deferred.promise
}

function reset(comName, options) {
	var deferred = Q.defer()

	var serialPort = new SerialPort(comName, {
		baudRate: options.baudrate
	})

	serialPort.on('open', () => {
		if(options.wait) {
			serialPort.close(() => deferred.resolve())
		} else {
			serialPort.set({
				rts: options.rts,
				dtr: options.dtr,
			})
			setTimeout(() => {
				serialPort.close(() => deferred.resolve())
			}, 650)
		}
	}).on('error', err => {
		log.error(err)
		serialPort.close(() => {
			deferred.reject(err)
		})
	})

	return deferred.promise
}

function waitReset(targetPort, before) {
	let deferred = Q.defer()

	let elapsed = 0
	let wait
	let timer
	wait = () => {
		if(elapsed > 10000) {
			deferred.reject()
			return
		}

		listSerialPort(true).then(ports => {
			let now = ports
			let diff = now.filter(port => before.indexOf(port) < 0)
			log.debug(`ports {${before.join(", ")}} / {${now.join(", ")}} => {${diff.join(", ")}}`)
			if (diff.length > 0) {
				let newPort = diff[0]
				log.debug("Found upload port: " + newPort)
				deferred.resolve(newPort)
				return
			}

			before = now
			elapsed += 250
			if (elapsed >= 5000 && now.indexOf(targetPort) >= 0) {
				log.debug("Uploading using selected port: " + targetPort)
				deferred.resolve(targetPort)
			} else {
				timer && clearTimeout(timer)
				timer = setTimeout(wait, 250)
			}
		}, err => {
			elapsed += 250
			timer && clearTimeout(timer)
			timer = setTimeout(wait, 250)
		})
	}

	wait()

	return deferred.promise
}

function toggleMonitor(enable) {
	if(enable) {
		usbDetect.on("change", onChange)
		usbDetect.startMonitoring()
	} else {
		usbDetect.stopMonitoring()
	}
}

function onError(portId, err) {
	postMessage("serialPort.onError", portId, err)
}

function onData(portId, data) {
	postMessage("serialPort.onData", portId, data)
}

function onClose(portId) {
	postMessage("serialPort.onClose", portId)
}

function onChange(device) {
	postMessage("serialPort.onChange")
}

module.exports.list = list
module.exports.open = open
module.exports.write = write
module.exports.close = closeAll
module.exports.closeAll = closeAll
module.exports.update = update
module.exports.flush = flush
module.exports.reset = reset
module.exports.waitReset = waitReset
module.exports.toggleMonitor = toggleMonitor
module.exports.onChange = onChange
