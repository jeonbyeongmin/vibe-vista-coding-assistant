import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js';
import { DIFFICULTY_CHOICES, FIELD_CHOICES, TIME_LIMIT_CHOICES } from './constants';

// VibeIdea 명령어
export const vibeIdeaCommand = new SlashCommandBuilder()
  .setName('vibeidea')
  .setDescription('재미있고 신선한 코딩 아이디어를 제공합니다')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('난이도')
      .setDescription('난이도를 선택하세요')
      .setRequired(true)
      .addChoices(...DIFFICULTY_CHOICES)
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('분야')
      .setDescription('코딩 분야를 선택하세요')
      .setRequired(false)
      .addChoices(...FIELD_CHOICES)
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('제한시간')
      .setDescription('제한시간을 선택하세요')
      .setRequired(false)
      .addChoices(...TIME_LIMIT_CHOICES)
  );

// 뉴스 설정 명령어
export const newsSetupCommand = new SlashCommandBuilder()
  .setName('setnews')
  .setDescription('개발 뉴스 알림을 설정합니다')
  .addChannelOption((option) =>
    option
      .setName('채널')
      .setDescription('뉴스를 받을 채널을 선택하세요')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

// 뉴스 테스트 명령어
export const newsTestCommand = new SlashCommandBuilder()
  .setName('testnews')
  .setDescription('개발 뉴스를 즉시 테스트해봅니다')
  .addStringOption((option) =>
    option
      .setName('타입')
      .setDescription('테스트할 뉴스 타입을 선택하세요')
      .setRequired(false)
      .addChoices({ name: '일일 뉴스', value: 'daily' }, { name: '주간 트렌드', value: 'weekly' })
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

// 퀴즈 명령어
export const quizCommand = new SlashCommandBuilder()
  .setName('quiz')
  .setDescription('개발 관련 퀴즈를 시작합니다')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('분야')
      .setDescription('퀴즈 분야를 선택하세요')
      .setRequired(false)
      .addChoices(
        { name: 'JavaScript', value: 'javascript' },
        { name: 'Python', value: 'python' },
        { name: 'React', value: 'react' },
        { name: 'Node.js', value: 'nodejs' },
        { name: 'TypeScript', value: 'typescript' },
        { name: '알고리즘', value: 'algorithm' },
        { name: '웹 개발', value: 'web' },
        { name: 'Git', value: 'git' },
        { name: '데이터베이스', value: 'database' },
        { name: '개발 상식', value: 'general' },
        { name: '랜덤', value: 'random' }
      )
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('난이도')
      .setDescription('퀴즈 난이도를 선택하세요')
      .setRequired(false)
      .addChoices(
        { name: '쉬움', value: 'easy' },
        { name: '중간', value: 'medium' },
        { name: '어려움', value: 'hard' },
        { name: '랜덤', value: 'random' }
      )
  );

// 모든 명령어를 배열로 내보내기
export const allCommands = [vibeIdeaCommand, newsSetupCommand, newsTestCommand, quizCommand];
