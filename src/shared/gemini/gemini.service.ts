import {
  Content,
  GenerateContentRequest,
  GenerateContentResult,
  GenerateContentStreamResult,
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

  public async createCompletion<T extends boolean>({
    messages,
    stream,
    tools,
  }: {
    messages: Partial<Message>[];
    stream?: T;
    tools?: GenerateContentRequest['tools'];
  }): Promise<
    T extends true ? GenerateContentStreamResult : GenerateContentResult
  > {
    const model = this.genAI.getGenerativeModel(
      { model: 'gemini-pro' },
      {
        apiVersion: 'v1beta',
      },
    );
    const contents = this.formatMessages(messages);

    const request: GenerateContentRequest = {
      contents,
      tools,
    };

    const result = stream
      ? await model.generateContentStream(request)
      : await model.generateContent(request);

    return result as T extends true
      ? GenerateContentStreamResult
      : GenerateContentResult;
  }

  public async createChatCompletion<T extends boolean>({
    messages,
    stream,
    tools,
  }: {
    messages: Partial<Message>[];
    stream?: T;
    tools?: GenerateContentRequest['tools'];
  }): Promise<
    T extends true ? GenerateContentStreamResult : GenerateContentResult
  > {
    const model = this.genAI.getGenerativeModel(
      { model: 'gemini-pro' },
      {
        apiVersion: 'v1beta',
      },
    );
    const history = this.buildHistory(messages);
    const lastMessage = history[history.length - 1];

    const chat = model.startChat({
      history: history,
      tools,
    });

    const userMessage = lastMessage.parts[0].text + '';
    const result = stream
      ? await chat.sendMessageStream(userMessage)
      : await chat.sendMessage(userMessage);

    return result as T extends true
      ? GenerateContentStreamResult
      : GenerateContentResult;
  }

  private formatMessages(messages: Partial<Message>[]): Content[] {
    return messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content + '' }],
    }));
  }

  private buildHistory(messages: Partial<Message>[]): Content[] {
    return messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content + '' }],
    }));
  }
}
