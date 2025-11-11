import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    host: true // 允许外部访问
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // 优化配置
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          vendor: ['vite']
        }
      }
    }
  },
  
  // 静态资源处理
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf'],
  
  // CSS 配置
  css: {
    devSourcemap: true
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': '/src',
      '@css': '/css',
      '@js': '/js',
      '@images': '/images'
    }
  }
})

