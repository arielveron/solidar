import { Test } from '@nestjs/testing';
import { HopeModule } from './hope.module';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';

describe('HopeModule', () => {
  const mockHopeResolver = {};
  const mockHopeService = {};

  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      providers: [
        HopeModule,
        { provide: HopeResolver, useValue: mockHopeResolver },
        { provide: HopeService, useValue: mockHopeService },
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});
