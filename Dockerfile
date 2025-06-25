# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 포트 설정 (Discord Bot은 특정 포트가 필요하지 않지만 설정)
EXPOSE 3000

# 환경변수 설정
ENV NODE_ENV=production

# 애플리케이션 실행
CMD ["npm", "start"]
