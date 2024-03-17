import { Module } from '@nestjs/common';
import { GeminiModule } from 'src/shared/gemini/gemini.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [GeminiModule],
})
export class ChatModule {}
