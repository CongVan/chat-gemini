import { z } from 'zod';
import { messageSchema } from '../message-dto/message-dto';

export const chatCompletionSchema = z.object({
  messages: z.array(messageSchema),
});

export type ChatCompletionDto = z.infer<typeof chatCompletionSchema>;

// export class ChatCompletionDto {
//   @MinLength(1)
//   @ValidateNested({ each: true })
//   messages: MessageDto[];
// }
