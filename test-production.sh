#!/bin/bash

echo "⚠️  프로덕션 환경 테스트 모드"
echo "================================="
echo ""
echo "🚨 주의: 현재 프로덕션 봇으로 테스트합니다!"
echo "   - 실제 서버에 영향을 줄 수 있습니다"
echo "   - 테스트 전용 채널에서만 사용하세요"
echo ""

read -p "계속하시겠습니까? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "✅ 프로덕션 봇으로 테스트 시작..."
    npm run build
    echo ""
    echo "🤖 봇 실행 중... (Ctrl+C로 중단)"
    NODE_ENV=development node dist/index.js
else
    echo "❌ 테스트 취소됨"
    echo ""
    echo "💡 안전한 테스트를 위해 다음 중 하나를 권장합니다:"
    echo "   1. 별도 테스트 봇 생성 후 .env.test 파일에 토큰 설정"
    echo "   2. npm run start:testbot 명령어 사용"
    exit 1
fi
