import { Migration } from '@mikro-orm/migrations';

export class Migration20250213050000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "warehouse" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "warehouse" drop column "description";`);
  }

}
