import path from 'path'
import fs from 'fs-extra'
import { merge } from 'lodash'
import util from './util'
import is from 'electron-is'
import Q from 'q'
import SerialPort from './serialPort'

const defaultBuildOptions = {
  fqbn: "arduino:avr:uno:cpu=atmega328p",
  prefs: {
    "runtime.tools.avr-gcc.path": '"ARDUINO_PATH/hardware/tools/avr"',
    "runtime.tools.avrdude.path": '"ARDUINO_PATH/hardware/tools/avr"',
    "build.warn_data_percentage": "75"
  },
  target: "hex",
  command: '"ARDUINO_PATH/arduino-builder" -compile -logger=machine -hardware="ARDUINO_PATH/hardware" -tools="ARDUINO_PATH/tools-builder" -tools="ARDUINO_PATH/hardware/tools/avr" BUILD_SPECS -ide-version=10612 -warnings=none -build-path="PROJECT_BUILD_PATH" "PROJECT_ARDUINO_FILE"',
};

const defaultUploadOptions = {
  target: "hex",
  mcu: "atmega328p",
  baudrate: 115200,
  programer: "arduino",
  reset: {
    baudrate: 1200,
    dtr: false,
    rts: true,
  },
  command: '"ARDUINO_PATH/hardware/tools/avr/bin/avrdude" -C "ARDUINO_PATH/hardware/tools/avr/etc/avrdude.conf" -v -p ARDUINO_MCU -c ARDUINO_PROGRAMMER -b ARDUINO_BURNRATE -P ARDUINO_COMPORT -D -U "flash:w:TARGET_PATH:i"'
};

const arduinoReg = /(COM\d+)|(usb-serial)|(arduino)|(\/dev\/cu\.usbmodem)|(\/dev\/tty\.)|(\/dev\/(ttyUSB|ttyACM|ttyAMA))/

function build(options) {
	let deferred = Q.defer()

	let { key, ino } = options
	let buildOptions = merge({}, defaultBuildOptions, options.build)
	let buildSpecs = []

	let dataPath = util.getAppPath("data")
	let builtInPackages = path.join(dataPath, "packages")
	let thirdPartyPackages = path.join(util.getAppPath("appDocuments"), "packages")
	let packagesSpecs = [builtInPackages, thirdPartyPackages].filter(packagesPath => fs.existsSync(packagesPath)).map(packagesPath => `-hardware="${packagesPath}"`)
	packagesSpecs.forEach(spec => buildSpecs.push(spec))

	let builtInLibraries = path.join(dataPath, "libraries")
	let thirdPartyLibraries = path.join(util.getAppPath("appDocuments"), "libraries")
	let librariesSpecs = [builtInLibraries, thirdPartyLibraries].filter(librariesPath => fs.existsSync(librariesPath)).map((librariesPath, index) => `${index === 0 ? "-built-in" : ""}-libraries="${librariesPath}"`)
	librariesSpecs.forEach(spec => buildSpecs.push(spec))

	buildSpecs.push(`-fqbn=${buildOptions.fqbn}`)

	let prefsSpecs = Object.keys(buildOptions.prefs).map(key => `-prefs=${key}=${handleQuotes(buildOptions.prefs[key])}`)
	prefsSpecs.forEach(spec => buildSpecs.push(spec))

	let arduinoPath = util.getAppPath("arduino")
	let meta = util.getMeta()
	let buildPath = path.join(util.getAppPath("temp"), meta.name, `arduino_build_${key}`)
	fs.ensureDirSync(buildPath)

	let command = handleQuotes(buildOptions.command)
	command = command.replace("BUILD_SPECS", buildSpecs.join(' '))
		.replace(/ARDUINO_PATH/g, arduinoPath)
		.replace("PROJECT_BUILD_PATH", buildPath)
		.replace("PROJECT_ARDUINO_FILE", ino)

	let commandPath = path.join(util.getAppPath("appData"), "temp", util.uuid(6))
	let scriptPath = path.join(dataPath, "scripts", `call.${is.windows() ? "bat" : "sh"}`)
	util.writeFile(commandPath, command)
	.then(() => util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}))
	.then(
		() => deferred.resolve(path.join(buildPath, `${path.basename(ino)}.${buildOptions.target}`)),
		err => util.rejectError(err, deferred),
		progress => deferred.notify({...progress, progress: matchBuildProgress(progress.output)})
	)
	.catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function upload(options) {
	let deferred = Q.defer()

	let { target, comName } = options
	let uploadOptions = merge({}, defaultUploadOptions, options.upload)

	let arduinoPath = util.getAppPath("arduino")
	let command = handleQuotes(uploadOptions.command)
	command = command.replace(/ARDUINO_PATH/g, arduinoPath)
		.replace("ARDUINO_MCU", uploadOptions.mcu)
		.replace("ARDUINO_BURNRATE", uploadOptions.baudrate)
		.replace("ARDUINO_PROGRAMMER", uploadOptions.programer)
		.replace("TARGET_PATH", target)
	let commandPath = path.join(util.getAppPath("appData"), "temp", util.uuid(6))
	let scriptPath = path.join(util.getAppPath("data"), "scripts", `call.${is.windows() ? "bat" : "sh"}`)

	let helper = {}
	reset(comName, uploadOptions.reset)
	.then(newComName => util.writeFile(commandPath, command.replace("ARDUINO_COMPORT", newComName)))
	.then(() => util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}))
	.then(
		() => deferred.resolve(),
		err => util.rejectError(err, deferred),
		progress => deferred.notify({...progress, progress: matchUploadProgress(progress.output, helper)})
	)
	.catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function list() {
	let deferred = Q.defer()

	SerialPort.list()
	.then(ports => deferred.resolve(ports.filter(p => arduinoReg.test(p.comName))))
	.catch(err => util.rejectError(err, deferred))

	return deferred.promise
}

function reset(comName, options) {
	let deferred = Q.defer()

	if(!options.wait) {
		SerialPort.reset(comName, options).then(() => deferred.resolve(comName))
		return deferred.promise
	}

	let originPorts
	SerialPort.list(true)
	.then(ports => {
		originPorts = ports
		return SerialPort.reset(comName, options)
	})
	.then(() => SerialPort.waitReset(comName, originPorts))
	.then(newComName => deferred.resolve(newComName))

	return deferred.promise
}

function handleQuotes(p) {
	return is.windows() ? p : p.replace(/"/g, "")
}

function matchBuildProgress(output = "") {
	let reg = /===info \|\|\| Progress \{\d+\} \|\|\| \[(\d+\.\d+)\]/g;
	let matches = output.match(reg);
	if(!matches) {
		return -1;
	}

	matches = reg.exec(matches[matches.length - 1]);
	return parseInt(matches[1]);
}

function matchUploadProgress(output, helper) {
	let reg;
	if(!helper.status) {
		reg = /Writing \|/g;
		if(reg.test(output)) {
			helper.status = "writing";
			return 20;
		}
		return 0;
	} else if(helper.status == "writing") {
		reg = / \| 100\% \d+\.\d+/g;
		if(reg.test(output)) {
			helper.status = "reading";
			return 80;
		}

		reg = /#/g;
		helper.writeCount = helper.writeCount || 0;
		while(reg.exec(output)) {
			helper.writeCount++;
		}
		return 20 + parseInt(60 * helper.writeCount / 50);
	} else if(helper.status === "reading") {
		reg = / \| 100\% \d+\.\d+/g;
		if(reg.test(output)) {
			helper.status = "done";
			return 100;
		}

		reg = /#/g;
		helper.checkCount = helper.checkCount || 0;
		while(reg.exec(output)) {
			helper.checkCount++;
		}
		return 80 + parseInt(20 * helper.checkCount / 50);
	} else {
		return 100;
	}
}

module.exports.build = build
module.exports.upload = upload
module.exports.list = list
