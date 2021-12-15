import { Test, TestingModule } from '@nestjs/testing';
import { HopeService } from './hope.service';

describe('HopeService', () => {
  let service: HopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HopeService],
    }).compile();

    service = module.get<HopeService>(HopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
