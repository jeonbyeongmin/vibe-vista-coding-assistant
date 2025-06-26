#!/bin/bash

echo "🧪 VibeVistaBot 기능 테스트 스크립트"
echo "================================="

echo ""
echo "📰 뉴스 API 테스트 중..."
curl -s "https://dev.to/api/articles?tag=programming&top=7&per_page=3" | jq -r '.[0].title' > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Dev.to API 연결 성공"
else
    echo "❌ Dev.to API 연결 실패"
fi

echo ""
echo "📊 GitHub API 테스트 중..."
curl -s -H "Accept: application/vnd.github.v3+json" -H "User-Agent: VibeVistaBot" "https://api.github.com/search/repositories?q=created:>2025-06-19&sort=stars&order=desc&per_page=1" | jq -r '.items[0].name' > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ GitHub API 연결 성공"
else
    echo "❌ GitHub API 연결 실패"
fi

echo ""
echo "🔧 환경 변수 확인 중..."

if [ -f .env ]; then
    echo "✅ .env 파일 존재"
    
    if grep -q "DISCORD_TOKEN" .env; then
        echo "✅ DISCORD_TOKEN 설정됨"
    else
        echo "❌ DISCORD_TOKEN 누락"
    fi
    
    if grep -q "GEMINI_API_KEY" .env; then
        echo "✅ GEMINI_API_KEY 설정됨"
    else
        echo "❌ GEMINI_API_KEY 누락"
    fi
else
    echo "❌ .env 파일 없음"
fi

echo ""
echo "📦 의존성 확인 중..."

if [ -f package.json ]; then
    echo "✅ package.json 존재"
    
    if npm list node-cron > /dev/null 2>&1; then
        echo "✅ node-cron 설치됨"
    else
        echo "❌ node-cron 누락"
    fi
    
    if npm list axios > /dev/null 2>&1; then
        echo "✅ axios 설치됨"
    else
        echo "❌ axios 누락"
    fi
else
    echo "❌ package.json 없음"
fi

echo ""
echo "📝 빌드 테스트 중..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ TypeScript 빌드 성공"
else
    echo "❌ TypeScript 빌드 실패"
fi

echo ""
echo "🎉 테스트 완료!"
echo "================================="
