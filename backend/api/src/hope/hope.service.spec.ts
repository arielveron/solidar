import { Test, TestingModule } from '@nestjs/testing';
import { HopeService } from './hope.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hope } from './models/hope.entity';
import { CreateHopeInput } from './dto/create-hope.input';
import { JwtPayload } from 'src/auth/dto/jwt.payload';

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
    find: jest.fn(() => {
      return hopesDatabase;
    }),
    create: jest.fn((hope) => {
      return hope;
    }),
    save: jest.fn((hope) => {
      console.log(hope);
      if (hope.subject === 'FAIL') {
        // code expects NestJs errors include a stack property
        // I'm mocking it here because it's part of NestJS. I'm not testing that
        return Promise.reject({ stack: 'Stack' });
      }

      const result: Hope = {
        ...hope,
        _id: 'someDatabaseId',
      };
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

      await expect(service.getHope('1')).resolves.toEqual(expectedHope);
    });

    it('should call getHope with an invalid id and return an undefined hope', async () => {
      const expectedHope = undefined;

      await expect(service.getHope('2')).resolves.toEqual(expectedHope);
      await expect(service.getHope('')).resolves.toEqual(expectedHope);
      await expect(service.getHope(null)).resolves.toEqual(expectedHope);
      await expect(service.getHope(undefined)).resolves.toEqual(expectedHope);
    });
  });

  describe('getHopes', () => {
    it('should call getHopes and return all hopes in hopesDatabase', async () => {
      const expectedHopes = hopesDatabase;

      await expect(service.getHopes()).resolves.toEqual(expectedHopes);
    });
  });
  // TODO: test getHopes dependent on user asking

  describe('createHope', () => {
    it('should call createHope with a createHopeInput and return a valid Hope', async () => {
      const expectedHope: Hope = {
        _id: expect.any(String),
        id: expect.any(String),
        subject: 'Some subject',
        description: 'Some description',
        createdAt: expect.any(String),
        createdBy: '1',
        forOrg: 'org',
        isPublished: true,
      };

      const createHopeInput: CreateHopeInput = {
        subject: 'Some subject',
        description: 'Some description',
        forOrg: 'org',
      };
      const user: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };

      await expect(service.createHope(createHopeInput, user)).resolves.toEqual(
        expectedHope,
      );
    });

    it('should call createHope with a valid createHopeInput and fail to save to database', async () => {
      const createHopeInput: CreateHopeInput = {
        subject: 'FAIL',
        description: 'Hope destined to fail on save to DB',
        forOrg: 'org',
      };
      const user: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };

      await expect(service.createHope(createHopeInput, user)).rejects.toEqual(
        new Error('Error saving to DB'),
      );
    });
  });
});
