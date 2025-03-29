import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { WardEntity } from './ward.entity';

@Entity('district')
export class DistrictEntity {
  constructor(data?: Partial<DistrictEntity>) {
    Object.assign(this, data);
  }

  @PrimaryColumn()
  code: number;

  @Column({ name: 'province_code' })
  provinceCode: number;

  @Column()
  name: string;

  @Column()
  codename: string;

  @ManyToOne(() => ProvinceEntity, (province) => province.districts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: Relation<ProvinceEntity>;

  @OneToMany(() => WardEntity, (ward) => ward.district, { cascade: true })
  wards: Relation<WardEntity[]>;
}
