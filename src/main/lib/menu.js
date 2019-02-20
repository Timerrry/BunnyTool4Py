import { Menu } from 'electron'
import util from './util'
import log from 'electron-log'

function setup() {
  let meta = util.getMeta()
  let appName = meta.name
  const template = [
    {
      label: appName,
      submenu: [
        {label: `关于${appName}`, click: () => onItemClick("about")},
        {type: 'separator'},
        {role: 'services', label: "服务", submenu: []},
        {type: 'separator'},
        {role: 'hide', label: `隐藏${appName}`},
        {role: 'hideothers', label: "隐藏其它应用"},
        {role: 'unhide', label: "显示全部"},
        {type: 'separator'},
        {role: 'quit', label: `退出${appName}`}
      ]
    },
    {
      label: '文件',
      submenu: [
        {label: "新建文件", accelerator: 'CommandOrControl+N', click: () => onItemClick("new")},
        {label: "打开...", accelerator: 'CommandOrControl+O', click: () => onItemClick("open")},
        {type: 'separator'},
        {label: "保存", accelerator: 'CommandOrControl+S', click: () => onItemClick("save")},
        {label: "另存为...", accelerator: 'Shift+CommandOrControl+S', click: () => onItemClick("save-as")},
        {type: 'separator'},
        {label: "删除当前文件", click: () => onItemClick("delete")}
      ]
    },
    {
      label: '编辑',
      submenu: [
        {label: "撤销", accelerator: "CommandOrControl+Z", click: () => onItemClick("undo")},
        {label: "重做", accelerator: "Shift+CommandOrControl+Z", click: () => onItemClick("redo")},
        {type: 'separator'},
        {label: "复制", accelerator: "CommandOrControl+C", click: () => onItemClick("copy")},
        {label: "剪切", accelerator: "CommandOrControl+X", click: () => onItemClick("cut")},
        {label: "粘贴", accelerator: "CommandOrControl+V", click: () => onItemClick("paste")},
        {type: 'separator'},
        {label: "全选", accelerator: "CommandOrControl+A", click: () => onItemClick("select-all")},
      ]
    },
    {
      role: 'window',
      label: "窗口",
      submenu: [
        {role: 'minimize', label: "最小化"},
        {role: 'zoom', label: "缩放"},
        {role: 'close', label: "关闭"},
      ]
    },
    {
      role: 'help',
      label: "帮助",
      submenu: [
        {label: '反馈', click: () => onItemClick("suggest")},
        {label: '检查更新', click: () => onItemClick("check-update")}
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function onItemClick(action) {
  util.postMessage("app.onMenuAction", action)
}

module.exports.setup = setup
