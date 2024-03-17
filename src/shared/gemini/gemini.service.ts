import {
  GenerateContentRequest,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'ai';
import { AppLogger } from '../logger/app-logger/app-logger';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private logger = new AppLogger('GeminiService');

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('googleAPIKey')!,
    );
  }

  public async createChatCompletion({ messages }: { messages: Message[] }) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = this.buildGoogleGenAIPrompt(messages);

    const result = await model.generateContentStream(prompt);
    return result;
  }

  private buildGoogleGenAIPrompt(messages: Message[]): GenerateContentRequest {
    return {
      contents: messages.map((message) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      })),
    };
  }
}
