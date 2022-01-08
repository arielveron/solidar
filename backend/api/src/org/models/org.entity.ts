import { UserType } from '../../user/models/user.type';
import { Column, Entity, Index, ObjectIdColumn, PrimaryColumn } from 'typeorm';

Entity();
export class Org {
  // identification properties
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  // descriptive properties
  @Index({ unique: true })
  @Column()
  ngoName: string;

  // administration properties
  @Column()
  managers: UserType[];

  // object birth properties
  @Column()
  enabled: boolean;

  @Column()
  createdAt: string;

  @Column()
  createdBy: string;
}
