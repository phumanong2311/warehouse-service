import { Migration } from '@mikro-orm/migrations';

export class Migration20250106070702 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "size" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "variant_id" varchar(255) null, constraint "size_pkey" primary key ("id"));`);

    this.addSql(`create table "inventory" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "warehouse_id" varchar(255) not null, "product_id" varchar(255) not null, "quantity" int not null, "batch" varchar(255) null, "expiration_date" timestamptz null, constraint "inventory_pkey" primary key ("id"));`);

    this.addSql(`alter table "size" add constraint "size_variant_id_foreign" foreign key ("variant_id") references "variant" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "inventory" add constraint "inventory_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade;`);
    this.addSql(`alter table "inventory" add constraint "inventory_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "size" cascade;`);

    this.addSql(`drop table if exists "inventory" cascade;`);
  }

}
