# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 (캐시 최적화)
COPY package*.json ./

# 모든 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 빌드된 파일과 production 의존성만 남기고 정리
RUN npm prune --production && \
    npm cache clean --force

# 환경변수 설정
ENV NODE_ENV=production

# 애플리케이션 실행
CMD ["npm", "start"]
