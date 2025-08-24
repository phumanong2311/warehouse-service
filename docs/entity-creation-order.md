# Entity Creation Order & Dependencies

## 🎯 Overview

This document outlines the correct order for creating entities in the Warehouse Service, ensuring proper dependencies and business logic flow.

## 📊 Entity Dependencies

### Database Schema Dependencies
```
Warehouse (Independent)
    ↓
Rack (depends on Warehouse)
    ↓
Category (Independent)
    ↓
Product (depends on Warehouse, Category, Rack)
    ↓
Variant (depends on Product, Rack)
    ↓
Inventory (depends on Warehouse, Variant, Unit)
```

### Foreign Key Relationships
- `Product.warehouse_id` → `Warehouse.id`
- `Product.category_id` → `Category.id`
- `Product.rack_id` → `Rack.id`
- `Rack.warehouse_id` → `Warehouse.id`
- `Variant.product_id` → `Product.id`
- `Variant.rack_id` → `Rack.id`
- `Inventory.warehouse_id` → `Warehouse.id`
- `Inventory.variant_id` → `Variant.id`
- `Inventory.unit_id` → `Unit.id`

## 🏗️ Creation Order

### 1. **Warehouse** (First Priority)
**Why First?** Warehouse is the foundation - all physical storage operations depend on it.

```typescript
// Domain Entity
export class DomainWarehouseEntity extends DomainBaseEntity {
  private code!: string;        // Unique identifier
  private name!: string;        // Warehouse name
  private address!: string;     // Physical location
  private phone!: string;       // Contact information
  private email!: string;       // Contact information
  private racks: DomainRackEntity[]; // Storage units
}
```

**API Endpoint:**
```http
POST /warehouse
Content-Type: application/json

{
  "name": "Phu Ma Distribution Center",
  "code": "WH-DC-001",
  "address": "123 Industrial Blvd, City, State 12345",
  "phone": "+1-555-0123",
  "email": "phumanong@gmail.com",
  "logo": "https://example.com/logo.png"
}
```

### 2. **Rack** (Second Priority)
**Why Second?** Racks belong to warehouses and provide specific storage locations.

```typescript
// Domain Entity
export class DomainRackEntity extends DomainBaseEntity {
  private name!: string;           // Rack identifier (e.g., "A1", "B2")
  private warehouseId!: string;    // Parent warehouse
}
```

**API Endpoint:**
```http
POST /rack
Content-Type: application/json

{
  "name": "A1",
  "warehouseId": "warehouse-uuid-here"
}
```

### 3. **Category** (Third Priority)
**Why Third?** Categories are independent but needed for product classification.

```typescript
// Domain Entity
export class DomainCategoryEntity extends DomainBaseEntity {
  private name!: string;        // Category name (e.g., "Electronics", "Clothing")
  private description?: string; // Category description
}
```

**API Endpoint:**
```http
POST /category
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### 4. **Product** (Fourth Priority)
**Why Fourth?** Products need warehouse, category, and rack to be properly stored.

```typescript
// Domain Entity
export class DomainProductEntity extends DomainBaseEntity {
  private name!: string;           // Product name
  private sku!: string;            // Stock Keeping Unit
  private categoryId!: string;     // Product category
  private warehouseId!: string;    // Storage warehouse
  private rackId?: string;         // Specific rack location
  private variants!: DomainVariantEntity[]; // Product variants
}
```

**API Endpoint:**
```http
POST /product
Content-Type: application/json

{
  "name": "iPhone 14 Pro",
  "sku": "IP14P-256-BLACK",
  "description": "Latest iPhone model",
  "categoryId": "category-uuid-here",
  "warehouseId": "warehouse-uuid-here",
  "rackId": "rack-uuid-here"
}
```

### 5. **Variant** (Fifth Priority)
**Why Fifth?** Variants are specific versions of products (color, size, etc.).

```typescript
// Domain Entity
export class DomainVariantEntity extends DomainBaseEntity {
  private productId!: string;      // Parent product
  private variantValueId!: string; // Specific variant (e.g., "Black", "256GB")
  private rackId?: string;         // Storage location
}
```

**API Endpoint:**
```http
POST /variant
Content-Type: application/json

{
  "productId": "product-uuid-here",
  "variantValueId": "variant-value-uuid-here",
  "rackId": "rack-uuid-here"
}
```

### 6. **Inventory** (Sixth Priority)
**Why Sixth?** Inventory tracks actual stock levels for specific variants in warehouses.

```typescript
// Domain Entity
export class DomainInventoryEntity extends DomainBaseEntity {
  private warehouseId!: string;    // Storage warehouse
  private variantId!: string;      // Product variant
  private unitId?: string;         // Unit of measurement
  private quantity!: number;       // Stock quantity
  private status!: InventoryStatus; // Stock status
}
```

**API Endpoint:**
```http
POST /inventory
Content-Type: application/json

{
  "warehouseId": "warehouse-uuid-here",
  "variantId": "variant-uuid-here",
  "unitId": "unit-uuid-here",
  "quantity": 100,
  "status": "available"
}
```

## 🔄 Seeder Implementation

The correct seeding order is implemented in `MainSeeder.ts`:

```typescript
export class MainSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager): Promise<void> {
    // 1. Warehouse first (foundation)
    await new WarehouseSeeder().run(em);

    // 2. Racks (belong to warehouses)
    await new RackSeeder().run(em);

    // 3. Categories (independent)
    await new CategorySeeder().run(em);

    // 4. Variant types and values (for product variants)
    await new VariantTypeSeeder().run(em);
    await new VariantValueSeeder().run(em);

    // 5. Products (need warehouse, category, rack)
    await new ProductSeeder().run(em);

    // 6. Variants (need products)
    await new VariantSeeder().run(em);
  }
}
```

## 🎯 Business Logic Flow

### Warehouse Management Flow
```
1. Create Warehouse
   ↓
2. Create Racks within Warehouse
   ↓
3. Assign Storage Zones
   ↓
4. Configure Warehouse Settings
```

### Product Management Flow
```
1. Create Category for Product Type
   ↓
2. Create Product (assign to Warehouse/Category)
   ↓
3. Create Product Variants
   ↓
4. Set Initial Inventory Levels
   ↓
5. Configure Product Rules
```

### Inventory Management Flow
```
1. Check Warehouse Capacity
   ↓
2. Verify Rack Availability
   ↓
3. Update Inventory Levels
   ↓
4. Track Stock Movements
   ↓
5. Generate Inventory Reports
```

## ⚠️ Common Mistakes

### ❌ Wrong Order Examples
```typescript
// ❌ DON'T: Create product before warehouse
const product = await createProduct({
  name: "iPhone",
  warehouseId: "non-existent-warehouse" // Will fail!
});

// ❌ DON'T: Create rack without warehouse
const rack = await createRack({
  name: "A1",
  warehouseId: "non-existent-warehouse" // Will fail!
});
```

### ✅ Correct Order Examples
```typescript
// ✅ DO: Create warehouse first
const warehouse = await createWarehouse({
      name: "Phu Ma DC",
  code: "WH-001"
});

// ✅ DO: Create rack with valid warehouse
const rack = await createRack({
  name: "A1",
  warehouseId: warehouse.id
});

// ✅ DO: Create product with all dependencies
const product = await createProduct({
  name: "iPhone",
  warehouseId: warehouse.id,
  categoryId: category.id,
  rackId: rack.id
});
```

## 🧪 Testing Considerations

### Unit Tests
```typescript
describe('Entity Creation Order', () => {
  it('should create warehouse before product', async () => {
    // Create warehouse first
    const warehouse = await createWarehouse(mockWarehouseData);

    // Then create product
    const product = await createProduct({
      ...mockProductData,
      warehouseId: warehouse.id
    });

    expect(product.warehouseId).toBe(warehouse.id);
  });
});
```

### Integration Tests
```typescript
describe('Full Entity Creation Flow', () => {
  it('should create complete product hierarchy', async () => {
    // 1. Warehouse
    const warehouse = await createWarehouse(mockWarehouseData);

    // 2. Rack
    const rack = await createRack({
      ...mockRackData,
      warehouseId: warehouse.id
    });

    // 3. Category
    const category = await createCategory(mockCategoryData);

    // 4. Product
    const product = await createProduct({
      ...mockProductData,
      warehouseId: warehouse.id,
      categoryId: category.id,
      rackId: rack.id
    });

    // Verify all relationships
    expect(product.warehouseId).toBe(warehouse.id);
    expect(product.categoryId).toBe(category.id);
    expect(product.rackId).toBe(rack.id);
  });
});
```

## 📋 Checklist

### Before Creating Product
- [ ] Warehouse exists and is active
- [ ] Category exists for product type
- [ ] Rack exists in target warehouse
- [ ] Warehouse has available capacity
- [ ] Product SKU is unique

### Before Creating Inventory
- [ ] Warehouse exists
- [ ] Product variant exists
- [ ] Unit of measurement exists
- [ ] Rack has available space
- [ ] Inventory tracking is enabled

## 🚀 Best Practices

### 1. **Validation First**
Always validate dependencies before creating entities:
```typescript
async createProduct(productData: CreateProductDto) {
  // Validate warehouse exists
  const warehouse = await this.warehouseRepo.findById(productData.warehouseId);
  if (!warehouse) {
    throw new Error('Warehouse not found');
  }

  // Validate category exists
  const category = await this.categoryRepo.findById(productData.categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  // Create product
  return this.productRepo.create(productData);
}
```

### 2. **Transaction Safety**
Use database transactions for related operations:
```typescript
async createProductWithInventory(productData: CreateProductDto, inventoryData: CreateInventoryDto) {
  return this.entityManager.transactional(async (em) => {
    const product = await em.create(Product, productData);
    const inventory = await em.create(Inventory, {
      ...inventoryData,
      productId: product.id
    });

    await em.persistAndFlush([product, inventory]);
    return { product, inventory };
  });
}
```

### 3. **Error Handling**
Provide clear error messages for dependency issues:
```typescript
try {
  await createProduct(productData);
} catch (error) {
  if (error.code === 'FOREIGN_KEY_VIOLATION') {
    throw new Error('Required warehouse, category, or rack not found');
  }
  throw error;
}
```

## 📈 Performance Considerations

### 1. **Batch Operations**
Create multiple entities in batches when possible:
```typescript
// Create multiple racks for a warehouse
const racks = await Promise.all(
  rackData.map(data => createRack({ ...data, warehouseId: warehouse.id }))
);
```

### 2. **Caching Dependencies**
Cache frequently accessed dependencies:
```typescript
// Cache warehouse data
const warehouseCache = new Map();
const warehouse = warehouseCache.get(warehouseId) ||
  await this.warehouseRepo.findById(warehouseId);
```

### 3. **Lazy Loading**
Use lazy loading for optional relationships:
```typescript
// Only load rack data when needed
if (product.rackId) {
  const rack = await this.rackRepo.findById(product.rackId);
}
```

## 🎉 Conclusion

Following the correct entity creation order ensures:

- **Data Integrity**: All foreign key constraints are satisfied
- **Business Logic**: Operations follow logical warehouse management flow
- **Performance**: Efficient database operations without constraint violations
- **Maintainability**: Clear dependencies make code easier to understand and modify

Remember: **Warehouse First, Then Product** - this is the foundation of proper warehouse management!
