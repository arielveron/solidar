import { Test, TestingModule } from '@nestjs/testing';
import { HopeService } from './hope.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hope } from './models/hope.entity';

describe('HopeService', () => {
  let service: HopeService;

  const hopesDatabase: Hope[] = [
    {
      _id: 'someId',
      id: '1',
      subject: 'Some subject',
      description: 'Some description',
      createdAt: Date.now().toString(),
      createdBy: '1',
      forOrg: 'org',
      isPublished: true,
    },
  ];

  const mockHopeRepository = {
    findOne: jest.fn((param) => {
      const result = hopesDatabase.find((hope) => hope.id === param.id);
      return result;
    }),
  };

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

  describe('getHope', () => {
    it('should call getHope with an id="1" and return a valid hope', async () => {
      const expectedHope: Hope = {
        _id: expect.any(String),
        id: '1',
        subject: expect.any(String),
        description: expect.any(String),
        createdAt: expect.any(String),
        createdBy: '1',
        forOrg: 'org',
        isPublished: true,
      };

      expect(service.getHope('1')).resolves.toEqual(expectedHope);
    });

    it('should call getHope with an invalid id and return an undefined hope', async () => {
      const expectedHope = undefined;

      expect(service.getHope('2')).resolves.toEqual(expectedHope);
      expect(service.getHope('')).resolves.toEqual(expectedHope);
      expect(service.getHope(null)).resolves.toEqual(expectedHope);
      expect(service.getHope(undefined)).resolves.toEqual(expectedHope);
    });
  });
});
