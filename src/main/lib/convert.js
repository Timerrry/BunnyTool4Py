import { InputStream, CommonTokenStream } from 'antlr4'
import { CLexer } from './antlr/CLexer'
import { CParser } from './antlr/CParser'
import { MyVisitor } from './antlr/MyVisitor'
import fs from 'fs'
import child_process from 'child_process'
import path from 'path'
import log from 'electron-log'
import Q from 'q'


const writeFile = Q.denodeify(fs.writeFile)
const readFile = Q.denodeify(fs.readFile)
const exec = Q.denodeify(child_process.exec)


const IND = 2;

function reformat(old) {
  let result = "";
  let indentation = 0;

  let lines = old.split(/\n/);
  try {
    for (var i in lines) {
      let s = lines[i];
      let countLeft = (s.match(/\</g) || []).length;
      let countRight = (s.match(/\<\//g) || []).length;
      countLeft -= countRight;

      if (countRight > countLeft) {
        indentation += IND * (countLeft - countRight);
        result += " ".repeat(indentation) + s.replace(/^ +/g, "") + "\n";
      } else {
        result += " ".repeat(indentation) + s.replace(/^ +/g, "") + "\n";
        indentation += IND * (countLeft - countRight);
      }
    }
  } catch (err) {

  }
  return result;
}

export function convert (src, includePath, tempPath) {

  includePath = includePath || path.resolve('data/packages/default/boards')
  tempPath = tempPath || 'temp'

  let deferred = Q.defer()

  if (/#include\w*<Arduino.h>/.test(src)) {

  } else {
    src = '#include <Arduino.h>\n' + src
  }

  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath)
}

  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // 预处理, 调用gcc
  const srcPath = path.resolve(path.join(tempPath, `${id}.c`))
  const intermediatePath = path.resolve(path.join(tempPath, `${id}.i`))

  writeFile(srcPath, src)
    .then(() => exec(`gcc -E -I ${includePath} -o ${intermediatePath} ${srcPath}`, { shell: true }))
    .then(() => readFile(intermediatePath, 'utf8'))
    .then(intermediate => {
      let chars = new InputStream(intermediate)
      let lexer = new CLexer(chars)
      let tokens = new CommonTokenStream(lexer)
      let parser = new CParser(tokens)
      parser.buildParseTrees = true
      let tree = parser.compilationUnit()
      let myVisitor = new MyVisitor()
      myVisitor.visitCompilationUnit(tree)
      fs.unlink(srcPath, () => {})
      fs.unlink(intermediatePath, () => {})
      // log.debug(reformat(myVisitor.result))
      deferred.resolve(reformat(myVisitor.result))
    })
    .catch(err => {
      log.error(err)
    })

  return deferred.promise
}

export function renderCode (code) {

}
