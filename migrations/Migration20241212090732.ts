import { Migration } from '@mikro-orm/migrations';

export class Migration20241212090732 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "variant_type" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, constraint "variant_type_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "variant_type" add constraint "variant_type_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "variant_value" ("id" varchar(255) not null, "created_at" date null default CURRENT_TIMESTAMP, "updated_at" date null default CURRENT_TIMESTAMP, "created_by" varchar(255) null, "updated_by" varchar(255) null, "name" varchar(255) not null, "variant_type_id" varchar(255) not null, constraint "variant_value_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "variant_value" add constraint "variant_value_name_unique" unique ("name");`,
    );

    this.addSql(
      `alter table "variant_value" add constraint "variant_value_variant_type_id_foreign" foreign key ("variant_type_id") references "variant_type" ("id") on update cascade;`,
    );

    this.addSql(`alter table "variant" drop column "name";`);

    this.addSql(
      `alter table "variant" add column "variant_value_id" varchar(255) not null;`,
    );
    this.addSql(
      `alter table "variant" add constraint "variant_variant_value_id_foreign" foreign key ("variant_value_id") references "variant_value" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "variant_value" drop constraint "variant_value_variant_type_id_foreign";`,
    );

    this.addSql(
      `alter table "variant" drop constraint "variant_variant_value_id_foreign";`,
    );

    this.addSql(`drop table if exists "variant_type" cascade;`);

    this.addSql(`drop table if exists "variant_value" cascade;`);

    this.addSql(`alter table "variant" drop column "variant_value_id";`);

    this.addSql(
      `alter table "variant" add column "name" varchar(255) not null;`,
    );
  }
}
