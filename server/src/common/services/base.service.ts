import {
  Repository,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entity: EntityTarget<T>,
  ) {}

  protected getRepo(manager?: EntityManager): Repository<T> {
    return manager ? manager.getRepository(this.entity) : this.repository;
  }
}
