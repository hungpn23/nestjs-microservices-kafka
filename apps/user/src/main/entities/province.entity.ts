import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('province')
export class ProvinceEntity {
  constructor(data?: Partial<ProvinceEntity>) {
    Object.assign(this, data);
  }

  @PrimaryColumn()
  code: number;

  @Column()
  name: string;

  @Column()
  codename: string;

  @OneToMany(() => DistrictEntity, (district) => district.province, {
    cascade: true,
  })
  districts: Relation<DistrictEntity[]>;
}
