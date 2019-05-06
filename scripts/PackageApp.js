import path from 'path'
import os from 'os'
import child_process from 'child_process'
import is from 'electron-is'
import fs from 'fs-extra'
import * as builder from 'electron-builder' //electron打包
import minimist from 'minimist' //命令行参数解析
import nconf from 'nconf'
import {path7za} from '7zip-bin'
import globby from 'globby'

function getPlatform() {
	if(is.windows()) {
		return "win"
	} else if(is.macOS()) {
		return "mac"
	} else {
		let arch = os.arch()
		if(arch.indexOf('arm') >= 0) {
			return "arm"
		} else {
			return "linux"
		}
	}
}

let args = minimist(process.argv.slice(2)) //命令行参数

let packagePath = path.resolve(__dirname, '../app/package.json')
let packageConfig = fs.readJsonSync(packagePath)

let platform = args.platform || getPlatform()
let branch = args.branch || packageConfig.branch || "beta"
let arch
let target
let ext

let targets
if (platform == "linux") {
	arch = "x64"
	target = args.target || "deb"
	ext = target
	targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
} else if (platform == "arm") {
	arch = args.arch || "armv7l"
	target = args.target || "dir"
	ext = target
	targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
} else if (platform == "mac") {
	arch = "x64"
	target = args.target || "dmg"
	ext = target
	targets = builder.Platform.MAC.createTarget(target)
} else {
	arch = args.arch || "ia32"
	target = args.target || "nsis"
	ext = "exe"
	targets = builder.Platform.WINDOWS.createTarget(target, builder.archFromString(arch))
}

nconf.file(packagePath)
nconf.set('buildInfo', {
	branch: branch,
	ext: ext,
	appBit: arch == "ia32" ? 32 : 64,
	date: parseInt(new Date().getTime() / 1000),
})
nconf.save()

let suffix = platform === "arm" ? `/${arch}` : ""
let extraFiles = [
	{from: `data/tools/clang-format/${platform}${suffix}`, to: `data/tools/clang-format`},
	// {from: `data/arduino/${platform}${suffix}`, to: `data/arduino`},
	"data/scripts",
	`!data/scripts/**/*.${platform == "win" ? "sh" : "bat"}`,
	"data/packages",
	// "data/libraries",
	"data/config",
	// "data/pxt/projects/.gitkeep",
	// "data/pxt/node_modules",
	// "data/pxt/package.json",
	// "data/pxt/index.js",
]
let extraResources = [
	"data/driver/**",
]
let winSign
if(platform === "win" && args.sign) {
	winSign = {
		certificateSubjectName: "91110114MA01CQAAXR",
		certificateSha1: "5AF22C4047A219CBB23DAC2288E23612BF1ACA89",
	}
}

let appOutDir

builder.build({
	targets,
	config: {
		extraFiles,
		extraResources,
		win: winSign,
		afterPack: context => {
			nconf.clear('buildInfo')
			nconf.save()
			appOutDir = context.appOutDir
			let extraSrc = "./data/extra"
			platform === "arm" && globby.sync(`${extraSrc}/**/*`).forEach(p => fs.copySync(p, p.replace(extraSrc, appOutDir)))
		},
	}
}).then(result => {
	let output
	if(target === "dir") {
		child_process.execSync(`cd ${is.windows() ? "/d " : ""}${path.dirname(appOutDir)} && "${path7za}" a -tzip -r "${path.basename(appOutDir)}.zip" ${path.basename(appOutDir)}`)
		output = `${appOutDir}.zip`
	} else {
		output = result[result.length - 1]
	}

	let archName = platform === "mac" || platform === "linux" || (platform === "win" && arch === "ia32") ? "" : `-${arch}`
	let name = `${packageConfig.productName}-${packageConfig.version}-${branch}${archName}${target === "dir" ? ".zip" : path.extname(output)}`
	let newPath = path.join(path.dirname(output), name)
	fs.moveSync(output, newPath, {overwrite: true})
	console.log(`build: dist/${path.basename(newPath)}`)
}).catch(err => {
	console.error(err)
	process.exit(-1)
})
