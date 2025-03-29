import { DistrictEntity } from '@user/src/main/entities/district.entity';
import { ProvinceEntity } from '@user/src/main/entities/province.entity';
import { WardEntity } from '@user/src/main/entities/ward.entity';
import fs from 'node:fs';
import path from 'node:path';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension/dist/seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const provinceRepository = dataSource.getRepository(ProvinceEntity);
    const mockPath = path.join(__dirname, '../../../../mock');
    const files = ['provinces.json', 'districts.json', 'wards.json'];
    const data = {};

    for (const file of files) {
      const filePath = path.join(mockPath, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      data[file.replace('.json', '')] = JSON.parse(fileData);
    }

    for (const provinceData of data['provinces']) {
      const province = new ProvinceEntity({
        code: provinceData.code,
        name: provinceData.name,
        codename: provinceData.codename,
      });

      const districtsForProvince = data['districts'].filter(
        (d) => d.province_code === provinceData.code,
      );

      const districtEntities = districtsForProvince.map((distData) => {
        const district = new DistrictEntity({
          code: distData.code,
          name: distData.name,
          codename: distData.codename,
          province: province,
        });

        const wardsForDistrict = data['wards'].filter(
          (w) => w.district_code === distData.code,
        );

        const wardEntities = wardsForDistrict.map((wardData) => {
          return new WardEntity({
            code: wardData.code,
            name: wardData.name,
            codename: wardData.codename,
            district: district,
          });
        });

        district.wards = wardEntities;
        return district;
      });

      province.districts = districtEntities;

      await provinceRepository.save(province);
    }

    console.log('Location seeding completed successfully!');
  }
}
