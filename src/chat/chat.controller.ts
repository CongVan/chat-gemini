import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { streamToResponse } from 'ai';
import { Response } from 'express';
import { AppLogger } from 'src/shared/logger/app-logger/app-logger';
import { ZodValidationPipe } from 'src/shared/validation/zod-validation-pipe/zod-validation-pipe';
import {
  ChatCompletionDto,
  chatCompletionSchema,
} from './chat-completion-dto/chat-completion-dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  private logger = new AppLogger('ChatController');

  constructor(private chatService: ChatService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(chatCompletionSchema))
  async chatCompletion(
    @Body() chatCompletionDTO: ChatCompletionDto,
    @Res() res: Response,
  ) {
    const stream = await this.chatService.chatCompletion(chatCompletionDTO);

    streamToResponse(stream, res);
  }
}
