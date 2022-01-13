import { Column, Entity, Index, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  // identification properties
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  // descriptive properties
  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isAdmin: boolean;

  // administration properties
  @Column()
  orgOwnerOf: string[];

  @Column()
  hopeCreatorOf: string[];

  // object birth properties
  @Column()
  enabled: boolean;

  @Column()
  createdAt: string;
}
