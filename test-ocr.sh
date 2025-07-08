#!/bin/bash

# OCR测试脚本
echo "🧪 Tesseract.js OCR 测试脚本"
echo "==============================="

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取服务器地址
if [ -z "$1" ]; then
    SERVER="http://localhost:3000"
else
    SERVER="$1"
fi

echo -e "${BLUE}服务器地址: $SERVER${NC}"
echo ""

# 检查是否有测试图片
if [ ! -f "test-image.jpg" ] && [ ! -f "test-image.png" ]; then
    echo -e "${RED}❌ 找不到测试图片文件${NC}"
    echo "请在当前目录放置一个测试图片文件:"
    echo "  - test-image.jpg"
    echo "  - test-image.png"
    echo ""
    echo "或者使用以下命令指定图片文件:"
    echo "  $0 $SERVER your-image.jpg"
    exit 1
fi

# 确定测试图片文件
if [ -n "$2" ]; then
    TEST_IMAGE="$2"
elif [ -f "test-image.jpg" ]; then
    TEST_IMAGE="test-image.jpg"
elif [ -f "test-image.png" ]; then
    TEST_IMAGE="test-image.png"
fi

echo -e "${BLUE}测试图片: $TEST_IMAGE${NC}"
echo ""

# 1. 健康检查
echo -e "${YELLOW}1. 健康检查 (GET)${NC}"
echo "curl -X GET $SERVER/api/test-ocr"
echo ""
response=$(curl -s -X GET "$SERVER/api/test-ocr")
echo -e "${GREEN}响应:${NC}"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""
echo "================================="
echo ""

# 2. OCR测试
echo -e "${YELLOW}2. OCR测试 (POST)${NC}"
echo "curl -X POST $SERVER/api/test-ocr -F 'file=@$TEST_IMAGE'"
echo ""

# 显示上传进度
echo -e "${BLUE}正在上传图片并执行OCR...${NC}"
response=$(curl -s -X POST "$SERVER/api/test-ocr" -F "file=@$TEST_IMAGE")

echo -e "${GREEN}响应:${NC}"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""

# 3. 检查结果
echo -e "${YELLOW}3. 结果分析${NC}"
success=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('success', 'unknown'))" 2>/dev/null)
if [ "$success" = "true" ]; then
    echo -e "${GREEN}✅ OCR识别成功!${NC}"
    
    # 提取关键信息
    text=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('text', 'N/A'))" 2>/dev/null)
    includes_amount=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('analysis', {}).get('includesAmount', 'N/A'))" 2>/dev/null)
    includes_name=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('analysis', {}).get('includesName', 'N/A'))" 2>/dev/null)
    is_valid=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('analysis', {}).get('isValidImage', 'N/A'))" 2>/dev/null)
    processing_time=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('debug', {}).get('processingTime', 'N/A'))" 2>/dev/null)
    
    echo -e "${BLUE}识别文本:${NC} $text"
    echo -e "${BLUE}包含金额:${NC} $includes_amount"
    echo -e "${BLUE}包含名字:${NC} $includes_name"
    echo -e "${BLUE}图片有效:${NC} $is_valid"
    echo -e "${BLUE}处理时间:${NC} $processing_time ms"
    
elif [ "$success" = "false" ]; then
    echo -e "${RED}❌ OCR识别失败${NC}"
    error=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('error', 'N/A'))" 2>/dev/null)
    echo -e "${RED}错误信息:${NC} $error"
else
    echo -e "${RED}❌ 无法解析响应${NC}"
fi

echo ""
echo "================================="

# 4. 更多测试选项
echo -e "${YELLOW}4. 更多测试选项${NC}"
echo ""
echo "测试不同的图片格式:"
echo "  curl -X POST $SERVER/api/test-ocr -F 'file=@image.png'"
echo "  curl -X POST $SERVER/api/test-ocr -F 'file=@image.jpeg'"
echo ""
echo "测试大文件处理:"
echo "  curl -X POST $SERVER/api/test-ocr -F 'file=@large-image.jpg'"
echo ""
echo "测试错误处理:"
echo "  curl -X POST $SERVER/api/test-ocr -F 'file=@non-image.txt'"
echo ""
echo "查看详细日志:"
echo "  curl -X POST $SERVER/api/test-ocr -F 'file=@$TEST_IMAGE' -v"
echo ""

# 5. 使用说明
echo -e "${YELLOW}5. 使用说明${NC}"
echo ""
echo "本地测试:"
echo "  npm run dev"
echo "  ./test-ocr.sh"
echo ""
echo "Vercel测试:"
echo "  vercel deploy"
echo "  ./test-ocr.sh https://your-project.vercel.app"
echo ""
echo "查看日志:"
echo "  vercel logs"
echo ""

echo -e "${GREEN}测试完成!${NC}" 