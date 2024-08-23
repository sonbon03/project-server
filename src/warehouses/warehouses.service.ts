import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/users/entities/store.entity';
import { In, Repository } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseEntity } from './entities/warehouse.entity';

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
    const upCase = createWarehouseDto.name.toUpperCase();
    const warehouseExit = await this.warehouseRepository.find({
      where: { name: upCase },
    });
    if (warehouseExit.length > 0)
      throw new BadRequestException('Warehouse was exists');
    createWarehouseDto.name = upCase;
    let warehouse = await this.warehouseRepository.create(createWarehouseDto);
    warehouse.store = currentStore;
    warehouse = await this.warehouseRepository.save(warehouse);
    return warehouse;
  }

  async findAll() {
    return await this.warehouseRepository.find();
  }

  async findOne(id: string) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: id },
      relations: { store: true },
    });
    if (!warehouse) throw new BadRequestException('Warehouse not found!');
    return warehouse;
  }

  async update(id: string, fields: Partial<UpdateWarehouseDto>): Promise<any> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, fields);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: string) {
    const warehouse = await this.findOne(id);
    return await this.warehouseRepository.delete(id);
  }

  async findById(id: string) {
    return await this.warehouseRepository.findOneBy({ id });
  }
}
