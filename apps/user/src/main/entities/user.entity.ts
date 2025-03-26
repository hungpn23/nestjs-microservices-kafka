import { Role } from '@libs/constants/role.enum';
import { AbstractEntity } from '@user/database/entities/abstract.entity';
import { Exclude } from 'class-transformer';
import { UUID } from 'crypto';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { SessionEntity } from './session.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber?: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => SessionEntity, (session) => session.user, { cascade: true })
  sessions: Relation<SessionEntity[]>;

  @OneToMany(() => AddressEntity, (address) => address.user, {
    cascade: true,
  })
  addresses: Relation<SessionEntity[]>;
}
