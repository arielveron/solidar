import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHopeInput } from './create-hope.input';
import { Hope } from './hope.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HopeService {
  constructor(
    @InjectRepository(Hope) private hopeRepository: Repository<Hope>,
  ) {}

  async createHope(createHopeInput: CreateHopeInput): Promise<Hope> {
    const { subject, description, createdAt } = createHopeInput;

    const hope = this.hopeRepository.create({
      id: uuid(),
      subject,
      description,
      createdAt,
    });

    return this.hopeRepository.save(hope);
  }
}
