import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAIStream } from 'ai';
import { GeminiService } from 'src/shared/gemini/gemini.service';
import { AppLogger } from 'src/shared/logger/app-logger/app-logger';
import { ChatCompletionDto } from './chat-completion-dto/chat-completion-dto';

@Injectable()
export class ChatService {
  private logger = new AppLogger('ChatService');
  constructor(private geminiService: GeminiService) {}

  async chatCompletion({ messages }: ChatCompletionDto) {
    const geminiStream = await this.geminiService.createChatCompletion({
      messages,
      stream: true,
    });

    const stream = GoogleGenerativeAIStream(geminiStream);

    return stream;
  }
}
