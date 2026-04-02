/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Repository,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';
import { Pages } from '../interfaces/page.interface';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entity: EntityTarget<T>,
  ) {}

  protected getRepo(manager?: EntityManager): Repository<T> {
    return manager ? manager.getRepository(this.entity) : this.repository;
  }

  protected async paginate(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    page: number,
    limit: number,
    manager?: EntityManager,
    order?: FindOptionsOrder<T>,
  ): Promise<Pages<T>> {
    const repo = this.getRepo(manager);
    const skip = (page - 1) * limit;

    const [data, total] = await repo.findAndCount({
      where,
      order: order ?? ({ createdAt: 'DESC' } as any),
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
