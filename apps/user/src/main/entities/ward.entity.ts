import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('ward')
export class WardEntity {
  constructor(data?: Partial<WardEntity>) {
    Object.assign(this, data);
  }

  @PrimaryColumn()
  code: number;

  @Column()
  name: string;

  @Column()
  codename: string;

  @ManyToOne(() => DistrictEntity, (district) => district.wards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'district_code', referencedColumnName: 'code' })
  district: Relation<DistrictEntity>;
}
