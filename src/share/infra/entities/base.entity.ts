import { Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export class InfraBaseEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ type: 'date', defaultRaw: 'CURRENT_TIMESTAMP', nullable: true })
  createdAt?: Date & Opt = new Date();

  @Property({
    type: 'date',
    defaultRaw: 'CURRENT_TIMESTAMP',
    nullable: true,
    onUpdate: () => new Date(),
  })
  updatedAt?: Date & Opt = new Date();

  @Property({ type: 'string', nullable: true })
  createdBy?: string;

  @Property({ type: 'string', nullable: true })
  updatedBy?: string;
}
