import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { GeminiModule } from 'src/shared/gemini/gemini.module';

@Module({
  providers: [BotUpdate],
  imports: [GeminiModule],
})
export class BotModule {}
