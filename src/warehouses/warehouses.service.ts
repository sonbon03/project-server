import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';
import { Repository } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseEntity } from './entities/warehouse.entity';
import { checkText } from 'src/utils/common/CheckText';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
  ) {}
  async create(
    createWarehouseDto: CreateWarehouseDto,
    currentStore: StoreEntity,
  ): Promise<any> {
    if (checkText(createWarehouseDto.name)) {
      throw new BadRequestException(
        'The category name contains special characters',
      );
    }
    const upCase = createWarehouseDto.name.toUpperCase();
    const warehouseExit = await this.warehouseRepository.find({
      where: { name: upCase, store: { id: currentStore.id } },
    });
    if (warehouseExit.length > 0)
      throw new BadRequestException('Warehouse was exists');
    createWarehouseDto.name = upCase;
    let warehouse = await this.warehouseRepository.create(createWarehouseDto);
    warehouse.store = currentStore;
    warehouse = await this.warehouseRepository.save(warehouse);
    return warehouse;
  }

  async findAll(currentStore: StoreEntity) {
    return await this.warehouseRepository.find({
      where: { store: { id: currentStore.id } },
    });
  }

  async findOne(id: string, currentStore: StoreEntity) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: id,
        store: {
          id: currentStore.id,
        },
      },
      relations: { store: true },
    });
    if (!warehouse) throw new BadRequestException('Warehouse not found!');
    return warehouse;
  }

  async update(
    id: string,
    fields: Partial<UpdateWarehouseDto>,
    currentStore: StoreEntity,
  ): Promise<any> {
    const warehouse = await this.findOne(id, currentStore);
    Object.assign(warehouse, fields);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: string) {
    const warehouse = await this.warehouseRepository.findOneBy({ id });
    if (!warehouse) throw new BadRequestException('Warehouse not found');
    return await this.warehouseRepository.delete(id);
  }

  async findById(id: string) {
    return await this.warehouseRepository.findOneBy({ id });
  }
}
