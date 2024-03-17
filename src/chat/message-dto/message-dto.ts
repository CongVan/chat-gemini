import { z } from 'zod';

export const messageSchema = z
  .object({
    id: z.coerce.string(),
    content: z.string(),
    role: z.enum(['system', 'user', 'assistant', 'function', 'tool', 'data']),
  })
  .required();

export type MessageDto = z.infer<typeof messageSchema>;
// export class MessageDto {
//   @IsNumber()
//   id: string;

//   @IsString()
//   content: string;

//   @IsEnum(['system', 'user', 'assistant', 'function', 'tool', 'data'])
//   role: 'system' | 'user' | 'assistant' | 'function' | 'tool' | 'data';

//   name?: string;
//   createdAt?: Date;
// }
