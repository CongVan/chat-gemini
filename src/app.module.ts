import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { GeminiService } from './shared/gemini/gemini.service';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './shared/gemini/gemini.module';
import configuration from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ChatModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
