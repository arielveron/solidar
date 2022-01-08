import { UserType } from '../../user/models/user.type';
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

Entity();
export class Ngo {
  // identification properties
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  // descriptive properties
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
