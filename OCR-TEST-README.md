# 🧪 Tesseract.js OCR 测试系统

这是一个专门用于测试 `tesseract.js` 在 Vercel 环境中运行的测试系统。

## 📋 测试内容

- ✅ 在 Node.js 环境中运行 tesseract.js
- ✅ WebAssembly 支持测试
- ✅ 韩语和英语 OCR 识别
- ✅ 关键词检测（금액: 20000/20,000/20.000 和 이름: 정영나/비버네일）
- ✅ 性能和内存使用监控
- ✅ 错误处理和调试

## 🚀 快速开始

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 检查API状态
curl -X GET http://localhost:3000/api/test-ocr

# 使用测试脚本
chmod +x test-ocr.sh
./test-ocr.sh
```

### 2. 手动curl测试

```bash
# 健康检查
curl -X GET http://localhost:3000/api/test-ocr

# 上传图片进行OCR
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg'

# 查看详细请求信息
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg' -v
```

## 📁 文件结构

```
/
├── app/api/test-ocr/route.ts       # 测试API路由
├── vercel.json                     # Vercel配置
├── next.config.ts                  # Next.js配置（包含WebAssembly支持）
├── test-ocr.sh                     # 测试脚本
└── OCR-TEST-README.md             # 本文档
```

## 🔧 配置说明

### vercel.json
```json
{
  "functions": {
    "app/api/test-ocr/route.ts": {
      "maxDuration": 30,        // 30秒超时
      "runtime": "nodejs20.x",  // Node.js运行时
      "memory": 1024           // 1GB内存
    }
  }
}
```

### next.config.ts
```typescript
webpack: (config, { isServer }) => {
  // 🔥 关键：启用WebAssembly支持
  config.experiments = {
    asyncWebAssembly: true,
    layers: true,
  };
  
  // 服务器端WebAssembly处理
  if (isServer) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
  }
}
```

## 📊 测试响应格式

### 成功响应
```json
{
  "success": true,
  "text": "정영나20000",
  "analysis": {
    "includesAmount": true,
    "includesName": true,
    "isValidImage": true
  },
  "debug": {
    "imageSize": 245678,
    "processingTime": 3456,
    "environment": "Vercel"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "requestInfo": {
    "fileName": "test-image.jpg",
    "fileType": "image/jpeg",
    "fileSize": 245678
  }
}
```

### 失败响应
```json
{
  "success": false,
  "error": "OCR识别失败: Worker initialization failed",
  "analysis": {
    "includesAmount": false,
    "includesName": false,
    "isValidImage": false
  },
  "debug": {
    "imageSize": 245678,
    "processingTime": 1234,
    "environment": "Vercel"
  }
}
```

## 🔍 调试指南

### 1. 查看日志
```bash
# 本地日志
npm run dev
# 查看控制台输出

# Vercel日志
vercel logs
```

### 2. 常见问题

**问题1: Worker initialization failed**
```
解决方案：
- 检查内存配置是否足够 (推荐1GB)
- 确认WebAssembly支持是否正确配置
- 验证Node.js版本是否 >= 14
```

**问题2: 超时错误**
```
解决方案：
- 增加maxDuration到30秒
- 优化图片大小 (推荐 < 2MB)
- 检查网络连接
```

**问题3: 识别准确度低**
```
解决方案：
- 提供更清晰的图片
- 确保文字对比度足够
- 检查图片方向是否正确
```

## 🧪 测试用例

### 1. 基本功能测试
```bash
# 测试包含金额的图片
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@amount-image.jpg'

# 测试包含名字的图片
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@name-image.jpg'

# 测试无效图片
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@invalid-image.jpg'
```

### 2. 边界测试
```bash
# 测试大文件
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@large-image.jpg'

# 测试小文件
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@small-image.jpg'

# 测试不同格式
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test.png'
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test.gif'
```

### 3. 错误处理测试
```bash
# 测试非图片文件
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@document.pdf'

# 测试空文件
curl -X POST http://localhost:3000/api/test-ocr

# 测试损坏的图片
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@corrupted.jpg'
```

## 🚀 部署到Vercel

### 1. 部署步骤
```bash
# 部署到Vercel
vercel deploy

# 部署到生产环境
vercel --prod
```

### 2. 测试部署
```bash
# 使用部署后的URL测试
./test-ocr.sh https://your-project.vercel.app

# 或者手动测试
curl -X POST https://your-project.vercel.app/api/test-ocr -F 'file=@test-image.jpg'
```

## 📈 性能监控

### 关键指标
- **处理时间**: 通常 2-10 秒
- **内存使用**: 峰值约 500-800MB
- **识别准确度**: 取决于图片质量
- **成功率**: 应 > 95%

### 优化建议
1. 图片预处理：调整大小、提高对比度
2. 内存管理：确保worker正确终止
3. 缓存策略：避免重复初始化worker
4. 错误重试：实现自动重试机制

## 🔗 相关链接

- [Tesseract.js GitHub](https://github.com/naptha/tesseract.js)
- [Vercel WebAssembly 文档](https://vercel.com/docs/functions/runtimes/wasm)
- [Next.js WebAssembly 支持](https://nextjs.org/docs/advanced-features/using-mdx)

## 📞 支持

如果遇到问题，请检查：
1. 本地测试是否正常
2. 图片格式和大小是否符合要求
3. 日志中的具体错误信息
4. Vercel配置是否正确

---

**注意**: 这个测试系统专门用于验证 tesseract.js 在 Vercel 环境中的可用性，不会影响现有的业务逻辑。 