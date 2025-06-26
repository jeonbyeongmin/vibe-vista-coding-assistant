#!/bin/bash

echo "🧪 VibeVistaBot 새 기능 테스트"
echo "=============================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 테스트 결과 카운터
PASS=0
FAIL=0

# 테스트 함수
test_function() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}🔍 $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 통과${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ 실패${NC}"
        ((FAIL++))
    fi
}

echo -e "\n📦 빌드 테스트"
echo "----------"
test_function "TypeScript 빌드" "npm run build"

echo -e "\n🔧 의존성 테스트"
echo "----------"
test_function "node-cron 설치 확인" "npm list node-cron"
test_function "axios 설치 확인" "npm list axios"
test_function "@types/node-cron 설치 확인" "npm list @types/node-cron"

echo -e "\n🌐 외부 API 테스트"
echo "----------"
test_function "Dev.to API 연결" "curl -s --max-time 10 'https://dev.to/api/articles?tag=programming&per_page=1' | jq -r '.[0].title'"
test_function "GitHub API 연결" "curl -s --max-time 10 -H 'Accept: application/vnd.github.v3+json' -H 'User-Agent: VibeVistaBot-Test' 'https://api.github.com/search/repositories?q=created:>2025-06-19&sort=stars&order=desc&per_page=1' | jq -r '.items[0].name'"

echo -e "\n📁 파일 구조 테스트"
echo "----------"
test_function "newsScheduler.ts 존재" "test -f src/newsScheduler.ts"
test_function "빌드된 newsScheduler.js 존재" "test -f dist/newsScheduler.js"
test_function "index.ts 업데이트 확인" "grep -q 'NewsScheduler' src/index.ts"

echo -e "\n🤖 AI 기능 테스트 (환경 변수 필요)"
echo "----------"
if [ -f .env ] && grep -q "GEMINI_API_KEY" .env; then
    echo "✅ Gemini API 키 설정됨"
    ((PASS++))
else
    echo "❌ Gemini API 키 누락 - 실제 AI 기능 테스트 불가"
    ((FAIL++))
fi

if [ -f .env ] && grep -q "DISCORD_TOKEN" .env; then
    echo "✅ Discord 토큰 설정됨"
    ((PASS++))
else
    echo "❌ Discord 토큰 누락 - 봇 실행 불가"
    ((FAIL++))
fi

echo -e "\n📊 테스트 결과"
echo "============"
echo -e "${GREEN}✅ 통과: $PASS${NC}"
echo -e "${RED}❌ 실패: $FAIL${NC}"

TOTAL=$((PASS + FAIL))
SUCCESS_RATE=$((PASS * 100 / TOTAL))

if [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "\n${GREEN}🎉 테스트 성공! ($SUCCESS_RATE% 통과)${NC}"
    echo "배포 준비가 완료되었습니다!"
    exit 0
else
    echo -e "\n${RED}⚠️  테스트 실패 ($SUCCESS_RATE% 통과)${NC}"
    echo "문제를 해결한 후 다시 테스트해주세요."
    exit 1
fi
