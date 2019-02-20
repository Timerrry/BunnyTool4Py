## 准备工作

### 环境要求
- `node` >= 8.11
- `npm` >= 5.6
- `yarn` >= 1.7
- `windows` VS2015或者全局安装npm模块windows-build-tools
- `macOS` XCode

### nodejs安装
- nodejs官网或者`nvm`

### 安装yarn
`npm i -g yarn`

### 安装windows-build-tools
- 本依赖仅Windows需要安装
- 以管理员身份运行PowerShell
- 然后`npm i -g windows-build-tools`
- 等待安装完毕(时间较长，耐心等待)

## 安装、调试、打包

### 依赖安装
`yarn dep`

### 补丁
`yarn patch`

### 运行
`yarn start`

### 调试
`yarn start-dev`，然后VSCode `F5`

### rebuild
`yarn rebuild`

### 打包
`yarn pkg [--arch=x64]`

### 一键(依赖安装 + 补丁 + rebuild + 打包)
`yarn foo [--arch=x64]`

## Todo
- license
- electron dev tools
- webpack bundle
- codesandbox https://github.com/CompuIves/codesandbox-client
