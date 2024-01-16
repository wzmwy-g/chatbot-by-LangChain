# chatbot前端搭建记录

使用react-vite作为模板进行构建

## 构建项目

- 安装node.js
- 进行项目创建

```
npm create vite@latest chatweb -- --template react-ts
```

用vite创建react-ts模板的项目

```
npm install
```

安装依赖

##  启动项目

```json
 "scripts": {

  "dev": "vite",// 启动开发服务器，别名：`vite dev`，`vite serve`

  "build": "tsc && vite build",//// 为生产环境构建产物

  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",

  "preview": "vite preview"//// 本地预览生产构建产物

 },
```

这一部分是启动脚本





## 目标：实现内容收发

工具：Fetch API

​	