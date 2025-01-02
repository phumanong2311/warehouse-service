import {
  EntityManager,
  EntityName,
  EntityRepository,
  FilterQuery,
  OrderDefinition,
  Populate,
} from '@mikro-orm/postgresql';

export class BaseRepository<T extends object> extends EntityRepository<T> {
  constructor(em: EntityManager, entityName: EntityName<T>) {
    super(em, entityName);
  }
  async findById(id: string): Promise<T> {
    return await this.findOneOrFail({ id } as FilterQuery<T>);
  }

  async findAllData(): Promise<T[]> {
    return await this.findAll();
  }

  validateRelations<T>(relations: string[], entity: T): Populate<T, string> {
    const validRelations: (keyof T)[] = Object.keys(entity) as (keyof T)[];
    const filteredRelations = relations.filter((relation) =>
      validRelations.includes(relation as keyof T),
    );
    return filteredRelations as unknown as Populate<T, string>;
  }

  // ex for query:
  // const query = {
  //   limit: 20,
  //   page: 2,
  //   filter: {
  //     name: { $like: '%Laptop%' }, // Lọc theo tên sản phẩm
  //     category: 'Electronics', // Lọc theo danh mục
  //   },
  // };
  async findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
    sort?: { field: string; order: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<{ data: T[]; total: number }> {
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit;
    const sort = query.sort ? { [query.sort.field]: query.sort.order } : {};
    const totalItem = await this.count(query.filter as FilterQuery<T>);
    const validatedRelations = this.validateRelations(
      query.relations as string[],
      this.entityName,
    );
    const data = await this.find(
      { ...(query.filter as FilterQuery<T>) },
      {
        limit,
        offset,
        orderBy: sort as OrderDefinition<T>,
        populate: validatedRelations,
      },
    );
    return {
      data: data,
      total: totalItem,
    };
  }

  async save(entity: T): Promise<T> {
    const _entity = this.create(entity as T);
    await this.em.persistAndFlush(_entity);
    await this.em.refresh(_entity);
    return _entity;
  }

  async update(id: string, entity: T): Promise<T> {
    const _entity = this.findOneOrFail({ id } as FilterQuery<T>);
    if (!_entity) throw new Error(`Entity with ${id} not found`);
    await this.em.assign(_entity, entity as any);
    await this.em.flush();
    await this.em.refresh(_entity);
    return _entity;
  }

  async delete(entity: T): Promise<void> {
    await this.em.removeAndFlush(entity);
  }
}
