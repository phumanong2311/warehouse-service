# Entity Creation

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
Variant (depends on Rack)
    ↓
Inventory (depends on Warehouse, Variant, Unit)
```

### Foreign Key Relationships
- `Rack.warehouse_id` → `Warehouse.id`
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

### 4. **Variant** (Fourth Priority)
**Why Fourth?** Variants are specific versions of items (color, size, etc.).

```typescript
// Domain Entity
export class DomainVariantEntity extends DomainBaseEntity {
  private variantValueId!: string; // Specific variant (e.g., "Black", "256GB")
  private rackId?: string;         // Storage location
}
```

**API Endpoint:**
```http
POST /variant
Content-Type: application/json

{
  "variantValueId": "variant-value-uuid-here",
  "rackId": "rack-uuid-here"
}
```

### 5. **Inventory** (Fifth Priority)
**Why Fifth?** Inventory tracks actual stock levels for specific variants in warehouses.

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

    // 4. Variant types and values (for variants)
    await new VariantTypeSeeder().run(em);
    await new VariantValueSeeder().run(em);

    // 5. Variants (need racks)
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

### Variant Management Flow
```
1. Create Category for Item Type
   ↓
2. Create Variants (assign to Rack)
   ↓
3. Set Initial Inventory Levels
   ↓
4. Configure Variant Rules
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
// ❌ DON'T: Create variant before warehouse
const variant = await createVariant({
  variantValueId: "black",
  rackId: "non-existent-rack" // Will fail!
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

// ✅ DO: Create variant with all dependencies
const variant = await createVariant({
  variantValueId: "black",
  rackId: rack.id
});
```

## 🧪 Testing Considerations

### Unit Tests
```typescript
describe('Entity Creation Order', () => {
  it('should create warehouse before variant', async () => {
    // Create warehouse first
    const warehouse = await createWarehouse(mockWarehouseData);

    // Create rack
    const rack = await createRack({
      ...mockRackData,
      warehouseId: warehouse.id
    });

    // Then create variant
    const variant = await createVariant({
      ...mockVariantData,
      rackId: rack.id
    });

    expect(variant.rackId).toBe(rack.id);
  });
});
```

### Integration Tests
```typescript
describe('Full Entity Creation Flow', () => {
  it('should create complete variant hierarchy', async () => {
    // 1. Warehouse
    const warehouse = await createWarehouse(mockWarehouseData);

    // 2. Rack
    const rack = await createRack({
      ...mockRackData,
      warehouseId: warehouse.id
    });

    // 3. Category
    const category = await createCategory(mockCategoryData);

    // 4. Variant
    const variant = await createVariant({
      ...mockVariantData,
      rackId: rack.id
    });

    // Verify all relationships
    expect(variant.rackId).toBe(rack.id);
  });
});
```

## 📋 Checklist

### Before Creating Variant
- [ ] Warehouse exists and is active
- [ ] Rack exists in target warehouse
- [ ] Warehouse has available capacity
- [ ] Variant value is unique

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
async createVariant(variantData: CreateVariantDto) {
  // Validate rack exists
  const rack = await this.rackRepo.findById(variantData.rackId);
  if (!rack) {
    throw new Error('Rack not found');
  }

  // Create variant
  return this.variantRepo.create(variantData);
}
```

### 2. **Transaction Safety**
Use database transactions for related operations:
```typescript
async createVariantWithInventory(variantData: CreateVariantDto, inventoryData: CreateInventoryDto) {
  return this.entityManager.transactional(async (em) => {
    const variant = await em.create(Variant, variantData);
    const inventory = await em.create(Inventory, {
      ...inventoryData,
      variantId: variant.id
    });

    await em.persistAndFlush([variant, inventory]);
    return { variant, inventory };
  });
}
```

### 3. **Error Handling**
Provide clear error messages for dependency issues:
```typescript
try {
  await createVariant(variantData);
} catch (error) {
  if (error.code === 'FOREIGN_KEY_VIOLATION') {
    throw new Error('Required rack not found');
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

Remember: **Warehouse First, Then Rack, Then Variant** - this is the foundation of proper warehouse management!
