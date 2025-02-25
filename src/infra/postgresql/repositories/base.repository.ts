import {
  EntityManager,
  EntityName,
  EntityRepository,
  FilterQuery,
  NotFoundError,
  OrderDefinition,
  Populate,
} from '@mikro-orm/postgresql';

export class BaseRepository<T extends object> extends EntityRepository<T> {
  constructor(em: EntityManager, entityName: EntityName<T>) {
    super(em, entityName);
  }
  async findById(id: string): Promise<T | null> {
    try {
      console.log(`Searching for entity with ID: ${id}`);
      const entity = await this.findOne({ id } as FilterQuery<T>);
      if (!entity) {
        console.warn(`Entity with ID ${id} not found.`);
        return null;
      }
      console.log(`Entity found:`, entity);
      return entity;
    } catch (error) {
      console.error(`Error in findById: ${error.message}`);
      throw new NotFoundError(`Error in findById: ${error.message}`);
    }
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
    try {
      // Tách limit và page khỏi filter để không bị sử dụng sai
      const { limit = 10, page = 1, filter = {}, sort, relations } = query;

      // Tính toán offset cho phân trang
      const offset = (page - 1) * limit;
      const sortOrder = sort ? { [sort.field]: sort.order } : {};

      // Đếm tổng số mục với điều kiện filter
      const totalItem = await this.count(filter as FilterQuery<T>);

      // Xác thực quan hệ
      const validatedRelations = this.validateRelations(
        relations as string[],
        this.entityName,
      );

      // Truy vấn dữ liệu
      const data = await this.find({ ...filter } as any, {
        limit,
        offset,
        orderBy: sortOrder as OrderDefinition<T>,
        populate: validatedRelations,
      });

      return {
        data: data,
        total: totalItem,
      };
    } catch (error) {
      // Log lỗi và ném lại một thông báo lỗi rõ ràng
      console.error('Error occurred while retrieving paginated data:', error);
      throw new Error('An error occurred while retrieving paginated data.');
    }
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
