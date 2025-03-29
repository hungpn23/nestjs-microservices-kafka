import { UUID } from '@libs/types/branded.type';
import { AbstractEntity } from '@user/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WardEntity } from './ward.entity';

@Entity('address')
export class AddressEntity extends AbstractEntity {
  constructor(data?: Partial<AddressEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: UUID;

  @Column({ name: 'ward_code' })
  wardCode: number;

  @Column({ name: 'receiver_name' })
  receiverName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  detail: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<UserEntity>;

  @ManyToOne(() => WardEntity, (ward) => ward.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ward_code', referencedColumnName: 'code' })
  ward: Relation<WardEntity>;
}
