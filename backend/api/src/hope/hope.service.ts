import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CreateHopeInput } from './create-hope.input';
import { Hope } from './hope.entity';

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

    this.logger.log(`Created Hope: ${hope.subject}`);
    this.logger.verbose(`Created Hope: ${JSON.stringify(hope)}`);

    return await this.hopeRepository.save(hope);
  }
}
