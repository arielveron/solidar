import { Test, TestingModule } from '@nestjs/testing';
import { HopeService } from './hope.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hope } from './models/hope.entity';

describe('HopeService', () => {
  let service: HopeService;

  const mockHopeRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HopeService,
        { provide: getRepositoryToken(Hope), useValue: mockHopeRepository },
      ],
    }).compile();

    service = module.get(HopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
