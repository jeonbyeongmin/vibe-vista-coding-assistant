import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  SlashCommandStringOption,
  Interaction,
} from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { generatePrompt } from './prompts';
import process from 'process';
import console from 'console';
import { setTimeout } from 'timers';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 여러 모델을 fallback으로 사용 (최신 모델부터 시도)
const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
const models = modelNames.map((name) => genAI.getGenerativeModel({ model: name }));

// 슬래시 명령어 정의
const vibeIdeaCommand = new SlashCommandBuilder()
  .setName('vibeidea')
  .setDescription('재미있고 신선한 코딩 아이디어를 제공합니다')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('난이도')
      .setDescription('난이도를 선택하세요')
      .setRequired(true)
      .addChoices(
        { name: '쉬움', value: '쉬움' },
        { name: '중간', value: '중간' },
        { name: '어려움', value: '어려움' },
        { name: '랜덤', value: '랜덤' }
      )
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('분야')
      .setDescription('코딩 분야를 선택하세요')
      .setRequired(false)
      .addChoices(
        { name: '웹 개발', value: '웹' },
        { name: '모바일 앱', value: '모바일' },
        { name: 'CLI/터미널', value: 'CLI' },
        { name: 'AI/머신러닝', value: 'AI' },
        { name: '데스크톱 앱', value: '데스크톱' },
        { name: '게임 개발', value: '게임' },
        { name: '유틸리티', value: '유틸' },
        { name: '데이터 분석', value: '데이터' },
        { name: 'API/백엔드', value: 'API' },
        { name: '자동화/스크립트', value: '자동화' },
        { name: '블록체인/Web3', value: '블록체인' },
        { name: 'IoT/하드웨어', value: 'IoT' },
        { name: '보안/해킹', value: '보안' },
        { name: '네트워킹', value: '네트워크' },
        { name: '데이터베이스', value: '데이터베이스' },
        { name: '개발도구', value: '개발도구' },
        { name: '알고리즘/수학', value: '알고리즘' },
        { name: '크롤링/스크래핑', value: '크롤링' },
        { name: '음성/오디오', value: '오디오' },
        { name: '이미지/그래픽', value: '이미지' },
        { name: '실시간/채팅', value: '실시간' },
        { name: '교육/학습', value: '교육' },
        { name: '기타', value: '기타' }
      )
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('제한시간')
      .setDescription('제한시간을 선택하세요')
      .setRequired(false)
      .addChoices(
        { name: '30분', value: '30m' },
        { name: '1시간', value: '1h' },
        { name: '3시간', value: '3h' },
        { name: '상관없음', value: '상관없음' }
      )
  );

// 아이디어 생성 함수 (fallback 지원)
async function generateIdea(field: string, difficulty: string, timeLimit: string): Promise<string> {
  const prompt = generatePrompt({ field, difficulty, timeLimit });

  console.log(
    `🎯 아이디어 생성 요청: 난이도=${difficulty}, 분야=${field || '없음'}, 제한시간=${timeLimit || '없음'}`
  );
  console.log(`📝 사용할 모델 순서: ${modelNames.join(' → ')}`);

  // 각 모델을 순서대로 시도
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const modelName = modelNames[i];

    try {
      console.log(`🤖 ${modelName} 모델로 아이디어 생성 중...`);

      // 타임아웃과 함께 API 호출
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 25000)),
      ]);

      const response = await result.response;
      const idea = response.text();

      console.log(`✅ ${modelName} 모델로 성공적으로 생성완료!`);
      return idea;
    } catch (error) {
      console.error(`❌ ${modelName} 모델 오류:`, error);

      // 타임아웃 처리
      if (error instanceof Error && error.message === 'Timeout') {
        console.log(`⏰ ${modelName} 모델 시간 초과`);
      }

      // API 특정 에러 처리
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        console.log(`🔍 ${modelName} 모델 HTTP 상태: ${status}`);

        if (status === 503) {
          console.log(`🔄 ${modelName} 모델이 과부하 상태`);
        } else if (status === 429) {
          console.log(`⏳ ${modelName} 모델 사용량 한도 도달`);
        } else if (status === 404) {
          console.log(`🔧 ${modelName} 모델을 찾을 수 없음`);
        }
      }

      // 마지막 모델이 아니면 다음 모델 시도
      if (i < models.length - 1) {
        console.log(`🔄 다음 모델 ${modelNames[i + 1]}로 재시도...`);
        continue;
      }
    }
  }

  // 모든 모델이 실패한 경우
  console.error('💥 모든 AI 모델에서 오류가 발생했습니다.');
  return `🤖 죄송합니다! 현재 AI 서비스에 일시적인 문제가 발생했습니다.

**다음 중 하나를 시도해보세요:**
• 잠시 후 다시 시도해주세요
• 다른 난이도나 분야로 시도해보세요
• 문제가 지속되면 개발자에게 문의해주세요

**오류 시간:** ${new Date().toLocaleString('ko-KR')}`;
}

// 봇 준비 완료
client.once('ready', async () => {
  console.log(`✅ ${client.user?.tag}으로 로그인했습니다!`);
  console.log('🎯 VibeVistaBot이 준비되었습니다!');

  // 슬래시 명령어 등록
  await registerCommands();
});

// 슬래시 명령어 처리
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'vibeidea') {
    try {
      // interaction이 유효한지 확인
      if (!interaction.isRepliable()) {
        console.log('⚠️ Interaction이 응답 불가능한 상태입니다.');
        return;
      }

      // 즉시 응답하여 시간 초과 방지
      await interaction.deferReply();

      const field = interaction.options.getString('분야') || '';
      const difficulty = interaction.options.getString('난이도') || '중간';
      const timeLimit = interaction.options.getString('제한시간') || '';

      console.log(`💡 아이디어 요청: 분야=${field}, 난이도=${difficulty}, 시간=${timeLimit}`);

      // 아이디어 생성
      const idea = await generateIdea(field, difficulty, timeLimit);

      // 응답 업데이트
      await interaction.editReply({
        content: `🚀 **새로운 코딩 아이디어가 도착했습니다!**\n\n${idea}`,
      });

      console.log('✅ 아이디어 응답 완료');
    } catch (error) {
      console.error('명령어 처리 오류:', error);

      try {
        // interaction이 아직 유효한지 확인
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({
            content: '❌ 아이디어 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
        } else {
          await interaction.reply({
            content: '❌ 아이디어 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            ephemeral: true,
          });
        }
      } catch (editError) {
        console.error('에러 응답 실패:', editError);
        // interaction이 이미 만료된 경우 무시
      }
    }
  }
});

// 슬래시 명령어 등록
async function registerCommands() {
  try {
    console.log('슬래시 명령어를 등록하는 중...');
    console.log('봇 ID:', client.user?.id);
    console.log('토큰 존재:', !!process.env.DISCORD_TOKEN);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    const result = await rest.put(Routes.applicationCommands(client.user!.id), {
      body: [vibeIdeaCommand.toJSON()],
    });

    console.log('✅ 슬래시 명령어가 성공적으로 등록되었습니다!');
    console.log('등록된 명령어 수:', Array.isArray(result) ? result.length : 'Unknown');
  } catch (error) {
    console.error('슬래시 명령어 등록 오류:', error);
  }
}

// 봇 로그인
client.login(process.env.DISCORD_TOKEN);

// 에러 핸들링
process.on('unhandledRejection', (error: unknown) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});
