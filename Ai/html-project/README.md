# HTML Project with Vite

这是一个使用 Vite 构建的现代 HTML/CSS/JavaScript 项目模板。

## 功能特性

- ⚡️ 快速的开发服务器和热重载
- 🎯 现代化的构建工具
- 📦 自动依赖管理
- 🔧 灵活的配置选项
- 📱 响应式设计
- 🎨 现代 CSS 特性

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这将启动开发服务器，通常会在 `http://localhost:3000` 打开。

### 构建生产版本

```bash
npm run build
```

构建的文件将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
html-project/
├── css/                 # CSS 样式文件
├── images/             # 图片资源
├── js/                 # JavaScript 文件
├── index.html          # 主 HTML 文件
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
└── README.md           # 项目说明
```

## Vite 配置说明

- **开发服务器**: 端口 3000，自动打开浏览器
- **构建输出**: `dist` 目录
- **路径别名**: 
  - `@` → `/src`
  - `@css` → `/css`
  - `@js` → `/js`
  - `@images` → `/images`

## 开发建议

1. 使用 ES6+ 模块语法
2. 利用 Vite 的热重载功能进行快速开发
3. 使用路径别名简化导入
4. 遵循现代 Web 开发最佳实践

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

