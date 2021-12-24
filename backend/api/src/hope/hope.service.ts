import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getHopes(): Promise<Hope[]> {
    return await this.hopeRepository.find();
  }

  async createHope(createHopeInput: CreateHopeInput): Promise<Hope> {
    const { subject, description } = createHopeInput;

    const hope = this.hopeRepository.create({
      id: uuid(),
      subject,
      description,
      createdAt: new Date().toISOString(),
    });

    try {
      const savedHope = await this.hopeRepository.save(hope);
      this.logger.log(`Created Hope: ${hope.subject}`);
      this.logger.verbose(`Created Hope: ${JSON.stringify(hope)}`);
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
