import fs from 'fs-extra'
import path from 'path'

let pxtRoot = path.join(__dirname, "../data/pxt")
fs.copySync(path.join(pxtRoot, "fixed"), path.join(pxtRoot, "node_modules"), { overwrite: true })
