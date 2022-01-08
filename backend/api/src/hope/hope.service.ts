import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from 'src/user/models/user.type';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';

@Injectable()
export class HopeService {
  constructor(
    @InjectRepository(Hope) private hopeRepository: Repository<Hope>,
  ) {}
  private logger = new Logger('HopeService');

  async getHope(id: string): Promise<Hope> {
    return await this.hopeRepository.findOne({ id: id });
  }

  async getHopes(): Promise<Hope[]> {
    return await this.hopeRepository.find();
  }

  async createHope(
    createHopeInput: CreateHopeInput,
    user: UserType,
  ): Promise<Hope> {
    const { subject, description } = createHopeInput;

    const hope: Hope = {
      _id: null,
      id: uuid(),
      subject,
      description,
      isPublished: true,
      createdAt: new Date().toISOString(),
      authorId: user.id,
    };

    const createdHope = this.hopeRepository.create(hope);

    try {
      const savedHope = await this.hopeRepository.save(createdHope);
      this.logger.log(`Created Hope: "${savedHope.subject}"`);
      this.logger.verbose(`Created Hope: ${JSON.stringify(savedHope)}`);
      return savedHope;
    } catch (error) {
      this.logger.error(
        `Failed to save hope "${createHopeInput.subject}"`,
        error.stack,
      );
      throw new InternalServerErrorException('Error saving to DB');
    }
  }
}
