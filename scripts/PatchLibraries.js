import path from 'path'
import fs from 'fs-extra'

let base = 'ftp://ftp.bunnyzoo.com/libraries'
let jsonPath = path.join(__dirname, "../data/config/libraries.json")
let result = fs.readJsonSync(jsonPath)
result.libraries.forEach(lib => lib.url = `${base}/${lib.archiveFileName}`)
fs.writeJsonSync(jsonPath, result, { spaces: 2 })
