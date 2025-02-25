import { Migration } from '@mikro-orm/migrations';

export class Migration20250213040924 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "description" varchar(255) null, constraint "category_pkey" primary key ("id"));`);

    this.addSql(`create table "unit" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "description" varchar(255) null, "conversion_rate" int null, constraint "unit_pkey" primary key ("id"));`);

    this.addSql(`create table "variant_type" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, constraint "variant_type_pkey" primary key ("id"));`);
    this.addSql(`alter table "variant_type" add constraint "variant_type_name_unique" unique ("name");`);

    this.addSql(`create table "variant_value" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "variant_type_id" varchar(255) not null, constraint "variant_value_pkey" primary key ("id"));`);
    this.addSql(`alter table "variant_value" add constraint "variant_value_name_unique" unique ("name");`);

    this.addSql(`create table "warehouse" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "code" varchar(255) not null, "phone" varchar(255) not null, "email" varchar(255) not null, "logo" varchar(255) not null, "address" varchar(255) not null, "registration_expiration_date" timestamptz not null, constraint "warehouse_pkey" primary key ("id"));`);
    this.addSql(`alter table "warehouse" add constraint "warehouse_code_unique" unique ("code");`);

    this.addSql(`create table "rack" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "warehouse_id" varchar(255) not null, constraint "rack_pkey" primary key ("id"));`);

    this.addSql(`create table "product" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "sku" varchar(255) not null, "description" varchar(255) null, "category_id" varchar(255) not null, "warehouse_id" varchar(255) not null, "rack_id" varchar(255) not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "variant" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "product_id" varchar(255) not null, "variant_value_id" varchar(255) not null, "rack_id" varchar(255) null, constraint "variant_pkey" primary key ("id"));`);

    this.addSql(`create table "inventory" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "warehouse_id" varchar(255) not null, "variant_id" varchar(255) not null, "unit_id" varchar(255) null, "quantity" int not null, "batch" varchar(255) null, "expiration_date" timestamptz null, "status" varchar(255) not null default 'available', constraint "inventory_pkey" primary key ("id"));`);

    this.addSql(`alter table "variant_value" add constraint "variant_value_variant_type_id_foreign" foreign key ("variant_type_id") references "variant_type" ("id") on update cascade;`);

    this.addSql(`alter table "rack" add constraint "rack_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade;`);

    this.addSql(`alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);
    this.addSql(`alter table "product" add constraint "product_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade;`);
    this.addSql(`alter table "product" add constraint "product_rack_id_foreign" foreign key ("rack_id") references "rack" ("id") on update cascade;`);

    this.addSql(`alter table "variant" add constraint "variant_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "variant" add constraint "variant_variant_value_id_foreign" foreign key ("variant_value_id") references "variant_value" ("id") on update cascade;`);
    this.addSql(`alter table "variant" add constraint "variant_rack_id_foreign" foreign key ("rack_id") references "rack" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "inventory" add constraint "inventory_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade;`);
    this.addSql(`alter table "inventory" add constraint "inventory_variant_id_foreign" foreign key ("variant_id") references "variant" ("id") on update cascade;`);
    this.addSql(`alter table "inventory" add constraint "inventory_unit_id_foreign" foreign key ("unit_id") references "unit" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" drop constraint "product_category_id_foreign";`);

    this.addSql(`alter table "inventory" drop constraint "inventory_unit_id_foreign";`);

    this.addSql(`alter table "variant_value" drop constraint "variant_value_variant_type_id_foreign";`);

    this.addSql(`alter table "variant" drop constraint "variant_variant_value_id_foreign";`);

    this.addSql(`alter table "rack" drop constraint "rack_warehouse_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_warehouse_id_foreign";`);

    this.addSql(`alter table "inventory" drop constraint "inventory_warehouse_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_rack_id_foreign";`);

    this.addSql(`alter table "variant" drop constraint "variant_rack_id_foreign";`);

    this.addSql(`alter table "variant" drop constraint "variant_product_id_foreign";`);

    this.addSql(`alter table "inventory" drop constraint "inventory_variant_id_foreign";`);

    this.addSql(`drop table if exists "category" cascade;`);

    this.addSql(`drop table if exists "unit" cascade;`);

    this.addSql(`drop table if exists "variant_type" cascade;`);

    this.addSql(`drop table if exists "variant_value" cascade;`);

    this.addSql(`drop table if exists "warehouse" cascade;`);

    this.addSql(`drop table if exists "rack" cascade;`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "variant" cascade;`);

    this.addSql(`drop table if exists "inventory" cascade;`);
  }

}
