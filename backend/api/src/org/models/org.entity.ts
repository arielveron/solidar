import { Column, Entity, Index, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Org {
  // identification properties
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  // descriptive properties
  @Index({ unique: true })
  @Column()
  orgName: string;

  // administration properties
  @Column()
  owners: string[];

  @Column()
  hopeCreators: string[];

  // object birth properties
  @Column()
  enabled: boolean;

  @Column()
  createdAt: string;

  @Column()
  createdBy: string;
}
