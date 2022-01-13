import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Hope {
  // identification properties
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  // descriptive properties
  @Column()
  subject: string;

  @Column()
  description: string;

  // object birth properties
  @Column()
  isPublished: boolean;

  @Column()
  createdAt: string;

  @Column()
  createdBy: string;
}
