## 源码维护 需执行以下命令,下载源码 
1. git clone https://github.com/zhangpeichuan001/baseProject.git
2. cd baseProject
3. 安装node
4. 安装yarn
5. yarn install


## 打包并生成文档
`````javascript
yarn lib
`````

## 生成文档
`````javascript
yarn doc
`````

## 生成文件说明
src 目录下 每个子目录会生成一个打包文件 **如：utils 回生成 utils.js**
webpack 会自动查找src子目录下的 **index.js**文件 作为入口文件使用


## 以下功能维护
- [x] utils.tools
- [x] utils.mixin
- [x] utils.cookies
- [x] utils.prototype
- [ ] utils.ajax
- [ ] utils.possmessage
- [ ] utils.socket
- [ ] utils.video
- [x] utils.map