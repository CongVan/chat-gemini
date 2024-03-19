import { FunctionDeclarationSchemaType } from '@google/generative-ai';
import {
  Command,
  Ctx,
  Hears,
  Message,
  On,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { GeminiService } from 'src/shared/gemini/gemini.service';
import { AppLogger } from 'src/shared/logger/app-logger/app-logger';
import { TelegrafContext } from 'src/types/Telegraf';
// import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';

// import { HELLO_SCENE_ID, WIZARD_SCENE_ID } from '../app.constants';

@Update()
export class BotUpdate {
  private logger = new AppLogger('BotUpdate');
  constructor(private geminiService: GeminiService) {}
  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  //   @Command('scene')
  //   async onSceneCommand(@Ctx() ctx: unknown): Promise<void> {
  //     // await ctx.scene.enter(HELLO_SCENE_ID);
  //   }

  //   @Command('wizard')
  //   async onWizardCommand(@Ctx() ctx: unknown): Promise<void> {
  //     // await ctx.scene.enter(WIZARD_SCENE_ID);
  //   }

  @On('text')
  async onMessage(
    @Message('text') text: string,
    @Ctx() ctx: TelegrafContext,
  ): Promise<string> {
    this.logger.log(`Received message: ${text}`, JSON.stringify(ctx.update));

    // . You then record these transactions and give response in array of object with the following details:
    // - "currency": This is the currency in which the transaction took place. If the user does not specify the currency, you should default to Vietnamese Dong (VND). The currency should be represented in a 3-character format like "VND" or "USD".
    // - "amount": This is the amount of the transaction. It should be represented as a decimal number like 20000 or 50000.
    // - "type": This is the type of the transaction. It can be either "in_come" or "out_come".
    // - "category": This is the category of the transaction. It can be things like "mua sắm", "đi chợ", "ăn uống", "chi tiêu",  etc. If the user does not specify a category, you should default to "Khác".
    // - "date": This is the date of the transaction. It should be represented in the format "YYYY-MM-DD". If the user does not specify a date, you should default to the current date.
    // - "note": This is an optional field that the user can use to add any additional information about the transaction.
    // // Note: The user can input multiple transactions in a single message. Each transaction should be separated by a new line or space or comma. For example:
    // // Hôm nay đi chợ 50k, đi siêu thị 100k, mua đồ ăn 200k
    const prompt = `
    You are an AI named Educate AI. You are a Money Agent that helps people keep track of their daily spending. 
    You communicate with users through user message, and they tell you about their transactions
    Per transaction can be represented as a string like "Hôm nay đi chợ 50k, đi siêu thị 100k, mua đồ ăn 200k". And one line can be one transaction.
    // Date time information: Today is ${new Date().toDateString()}.
    // User Message: ${text}
    `;

    const result = await this.geminiService.createCompletion({
      stream: false,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      tools: [
        {
          functionDeclarations: [
            {
              name: 'create_transaction',
              description: 'Keep track of daily spending',
              parameters: {
                type: FunctionDeclarationSchemaType.OBJECT,
                properties: {
                  data: {
                    type: FunctionDeclarationSchemaType.ARRAY,
                    items: {
                      type: FunctionDeclarationSchemaType.OBJECT,
                      properties: {
                        currency: {
                          type: FunctionDeclarationSchemaType.STRING,
                          description:
                            ' This is the currency in which the transaction took place. If the user does not specify the currency, you should default to Vietnamese Dong (VND). The currency should be represented in a 3-character format like "VND", "USD" or etc',
                        },
                        amount: {
                          type: FunctionDeclarationSchemaType.NUMBER,
                          description:
                            'This is the amount of the transaction. It should be represented as a decimal number like 20000 or 50000',
                        },
                        type: {
                          type: FunctionDeclarationSchemaType.STRING,
                          enum: ['in_come', 'out_come'],
                          description:
                            'This is the type of the transaction. It can be either "in_come" or "out_come"',
                        },
                        category: {
                          type: FunctionDeclarationSchemaType.STRING,
                          enum: [
                            'Mua sắm',
                            'Ăn uống',
                            'Thanh toán hóa đơn',
                            'Tiền lương',
                            'Tiền thuê nhà',
                            'Chi tiêu cá nhân',
                            'Đi lại',
                            'Giáo dục',
                            'Sức khỏe',
                            'Giải trí',
                            'Du lịch',
                            'Đầu tư',
                            'Bảo hiểm',
                            'Tiết kiệm',
                            'Vay mượn',
                            'Trả nợ',
                            'Quà tặng',
                            'Thu nhập khác',
                            'Chi tiêu khác',
                          ],
                          description:
                            'This is the category of the transaction',
                        },
                        date: {
                          type: FunctionDeclarationSchemaType.STRING,
                          description: `This is the date of the transaction. It should be represented in the format 'YYYY-MM-DD'. If the user does not specify a date, you should default to the today. today is ${new Date().toDateString()}`,
                        },
                        note: {
                          type: FunctionDeclarationSchemaType.STRING,
                          description:
                            'The summary of the transaction. It is optional. If the user does not specify a note, you should default to the reason of the transaction. For example: "Mua đồ ăn", "Đi chợ", "Mua sắm", "Ăn uống", "Chi tiêu", "Thu nhập" or etc. If the user specify a note, you should default to the user input.',
                        },
                      },
                      required: [
                        'currency',
                        'amount',
                        'type',
                        'category',
                        'date',
                        'note',
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    });

    this.logger.log(result);
    const transaction =
      result.response.candidates?.[0]?.content?.parts?.[0]?.functionCall?.args;
    return `${transaction ? JSON.stringify(transaction) : 'no response'}`;
  }
}
