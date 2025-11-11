# Coze AI 智能助手

一个基于 Coze AI API 的现代化智能对话界面。

## 功能特性

- 🤖 与 Coze AI 进行智能对话
- 🎨 现代化的 UI 设计
- 📱 完全响应式布局
- ⚡ 实时状态指示
- 📋 一键复制回答
- 🌙 深色模式支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API 密钥

1. 复制 `.env.example` 文件为 `.env`
2. 在 `.env` 文件中填入你的 Coze AI API 密钥：

```env
VITE_COZE_API_KEY=your_actual_api_key_here
```

### 3. 配置 Bot ID

在 `js/main.js` 文件中，将 `your-bot-id` 替换为你的实际 Bot ID：

```javascript
const payload = {
    conversation_id: "coze-ai-chat",
    bot_id: "your-actual-bot-id", // 替换为实际的 Bot ID
    user: "user-001",
    query: "你好！请介绍一下你自己，并告诉我你能做什么。",
    stream: false,
};
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 获取 API 密钥和 Bot ID

1. 访问 [Coze 官网](https://www.coze.cn/)
2. 注册并登录账号
3. 在控制台中创建 Bot
4. 获取 API 密钥和 Bot ID

## 项目结构

```
cozeAI/
├── css/
│   ├── style.css          # 主样式文件
│   └── responsive.css     # 响应式样式
├── js/
│   └── main.js           # 主要 JavaScript 逻辑
├── index.html            # 主页面
├── package.json          # 项目配置
├── vite.config.js        # Vite 配置
└── .env                  # 环境变量（需要创建）
```

## 技术栈

- **前端框架**: 原生 HTML/CSS/JavaScript
- **构建工具**: Vite
- **样式**: 现代 CSS3 + 响应式设计
- **API**: Coze AI API

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License