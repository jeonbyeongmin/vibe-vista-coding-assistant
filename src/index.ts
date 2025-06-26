import { Client, GatewayIntentBits, REST, Routes, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import process from 'process';
import console from 'console';
import { NewsScheduler } from './newsScheduler';
import { AIService } from './AIService';
import { CommandHandler } from './CommandHandler';
import { allCommands } from './commands';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// 서비스 인스턴스
let newsScheduler: NewsScheduler;
let aiService: AIService;
let commandHandler: CommandHandler;

// 봇 준비 완료
client.once('ready', async () => {
  console.log(`✅ ${client.user?.tag}으로 로그인했습니다!`);
  console.log('🎯 Vibe Vista Coding Assistant가 준비되었습니다!');

  // 서비스 초기화
  aiService = new AIService(process.env.GEMINI_API_KEY!);
  newsScheduler = new NewsScheduler(client, aiService);
  commandHandler = new CommandHandler(aiService, newsScheduler);

  // 뉴스 스케줄러 시작
  newsScheduler.startScheduler();

  // 슬래시 명령어 등록
  await registerCommands();
});

// 슬래시 명령어 처리
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case 'vibeidea':
      await commandHandler.handleVibeIdeaCommand(interaction);
      break;
    case 'setnews':
      await commandHandler.handleNewsSetupCommand(interaction);
      break;
    default:
      console.log(`알 수 없는 명령어: ${commandName}`);
  }
});

// 슬래시 명령어 등록
async function registerCommands() {
  try {
    console.log('슬래시 명령어를 등록하는 중...');
    console.log('봇 ID:', client.user?.id);
    console.log('토큰 존재:', !!process.env.DISCORD_TOKEN);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    const commands = allCommands.map((command) => command.toJSON());

    const result = await rest.put(Routes.applicationCommands(client.user!.id), {
      body: commands,
    });

    console.log('✅ 슬래시 명령어가 성공적으로 등록되었습니다!');
    console.log('등록된 명령어 수:', Array.isArray(result) ? result.length : 'Unknown');
    console.log('등록된 명령어:', commands.map((cmd) => cmd.name).join(', '));
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
