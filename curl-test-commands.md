# 🧪 Curl 测试命令

这里是一些可以直接复制粘贴的测试命令：

## 本地测试 (http://localhost:3000)

### 1. 健康检查
```bash
curl -X GET http://localhost:3000/api/test-ocr
```

### 2. OCR测试 (需要先准备测试图片)
```bash
# 基本OCR测试
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg'

# 查看详细信息
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg' -v

# 测试不同格式
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.png'
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.gif'
```

## Vercel测试 (替换为你的域名)

### 1. 健康检查
```bash
curl -X GET https://your-project.vercel.app/api/test-ocr
```

### 2. OCR测试
```bash
# 基本OCR测试
curl -X POST https://your-project.vercel.app/api/test-ocr -F 'file=@test-image.jpg'

# 查看详细信息
curl -X POST https://your-project.vercel.app/api/test-ocr -F 'file=@test-image.jpg' -v
```

## 常见测试场景

### 测试成功场景
```bash
# 测试包含金额的图片 (包含 20000, 20,000, 20.000)
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@amount-image.jpg'

# 测试包含名字的图片 (包含 정영나 或 비버네일)
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@name-image.jpg'
```

### 测试失败场景
```bash
# 测试无效图片
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@invalid-image.jpg'

# 测试非图片文件
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@document.txt'

# 测试空请求
curl -X POST http://localhost:3000/api/test-ocr
```

## 使用测试脚本 (推荐)

```bash
# 确保脚本有执行权限
chmod +x test-ocr.sh

# 本地测试
./test-ocr.sh

# 测试特定域名
./test-ocr.sh https://your-project.vercel.app

# 使用特定图片
./test-ocr.sh http://localhost:3000 your-image.jpg
```

## 预期响应格式

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
    "environment": "Local"
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
  }
}
```

## 调试技巧

### 1. 查看详细HTTP信息
```bash
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg' -v
```

### 2. 保存响应到文件
```bash
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg' -o response.json
```

### 3. 格式化JSON响应
```bash
curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg' | python3 -m json.tool
```

### 4. 测试响应时间
```bash
time curl -X POST http://localhost:3000/api/test-ocr -F 'file=@test-image.jpg'
```

## 注意事项

1. **测试图片**: 确保有 `test-image.jpg` 或 `test-image.png` 文件
2. **文件大小**: 推荐 < 2MB，最大 10MB
3. **图片格式**: 支持 JPG, PNG, GIF
4. **处理时间**: 通常需要 2-10 秒
5. **网络**: 确保服务器运行正常

准备好测试图片后，就可以开始测试了！🚀 