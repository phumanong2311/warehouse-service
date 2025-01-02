import { Entity, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';

@Entity({ tableName: 'category' })
export class Category extends InfraBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;
}
