import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherEnity } from './entities/voucher.entity';
import { checkText } from 'src/utils/common/CheckText';
import { StoreEntity } from 'src/store/entities/store.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(VoucherEnity)
    private readonly vouchersRepository: Repository<VoucherEnity>,
  ) {}
  async create(createVoucherDto: CreateVoucherDto, currentStore: StoreEntity) {
    if (checkText(createVoucherDto.name)) {
      throw new BadRequestException(
        'The voucher name contains special characters',
      );
    }
    const checkKey = await this.vouchersRepository.findOne({
      where: { key: createVoucherDto.key, store: { id: currentStore.id } },
    });
    if (checkKey) throw new BadRequestException('Voucher exists');
    const voucher = await this.vouchersRepository.create(createVoucherDto);
    voucher.store = currentStore;
    return await this.vouchersRepository.save(voucher);
  }

  async findAllPagination(
    currentStore: StoreEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    const [result, total] = await this.vouchersRepository.findAndCount({
      where: { store: { id: currentStore.id } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const totalPages = Math.ceil(total / limit);

    return {
      data: result,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findAll(currentStore: StoreEntity) {
    return await this.vouchersRepository.find({
      where: { store: { id: currentStore.id } },
    });
  }

  async findOne(id: string, currentStore: StoreEntity) {
    const voucher = await this.vouchersRepository.findOne({
      where: { id: id, store: { id: currentStore.id } },
    });
    if (!voucher) throw new BadRequestException('Voucher not found');

    return voucher;
  }

  async update(
    id: string,
    fields: Partial<UpdateVoucherDto>,
    currentStore: StoreEntity,
  ) {
    const checkKey = await this.vouchersRepository.findOne({
      where: { key: fields.key, store: { id: currentStore.id } },
    });
    if (checkKey) throw new BadRequestException('Key exists');
    const voucher = await this.findOne(id, currentStore);
    Object.assign(voucher, fields);
    return await this.vouchersRepository.save(voucher);
  }

  async remove(id: string) {
    const voucher = await this.vouchersRepository.findOne({
      where: { id: id },
    });
    if (!voucher) throw new BadRequestException('Voucher not found');

    return await this.vouchersRepository.delete(voucher);
  }

  async getVouchersByTotal(total: number, currentStore: StoreEntity) {
    const roundedTotal = Math.floor(total);
    const vouchers = await this.vouchersRepository.find({
      where: {
        limit_money: LessThanOrEqual(roundedTotal),
        store: { id: currentStore.id },
      },
      order: { money: 'DESC' },
    });
    return vouchers;
  }
}
