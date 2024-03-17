import { ZodValidationPipe } from './zod-validation-pipe';

describe('ZodValidator', () => {
  it('should be defined', () => {
    expect(new ZodValidationPipe({} as any)).toBeDefined();
  });
});
