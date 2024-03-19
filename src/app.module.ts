import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ChatModule } from './chat/chat.module';
import configuration from './shared/config/configuration';
import { GeminiModule } from './shared/gemini/gemini.module';
import { GeminiService } from './shared/gemini/gemini.service';
import { session } from 'telegraf';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BotModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        botName: 'bot',
        middlewares: [session()],
        token: configService.get('telegramBotToken')!,
        include: [BotModule],
      }),
    }),
    ChatModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
