# Warehouse Service API Documentation

## Overview

The Warehouse Service provides comprehensive warehouse and inventory management capabilities following Clean Architecture principles. This service handles warehouse operations, inventory tracking, and stock management.

## Base URL

```
http://localhost:3000/warehouse
```

## Authentication

All endpoints require proper authentication. Include the authentication token in the request headers:

```
Authorization: Bearer <your-token>
```

## Warehouse Management

### List Warehouses with Pagination

**Endpoint**: `GET /warehouse`

**Query Parameters**:
- `limit` (optional): Number of items per page (default: 10)
- `page` (optional): Page number (default: 1)
- `name` (optional): Filter by warehouse name
- `code` (optional): Filter by warehouse code
- `phone` (optional): Filter by phone number
- `email` (optional): Filter by email
- `address` (optional): Filter by address
- `createdBy` (optional): Filter by creator
- `updatedBy` (optional): Filter by updater
- `createdAt` (optional): Filter by creation date
- `updatedAt` (optional): Filter by update date
- `sort[field]` (optional): Sort field
- `sort[order]` (optional): Sort order (ASC/DESC)

**Example Request**:
```bash
GET /warehouse?limit=10&page=1&name=Main&sort[field]=createdAt&sort[order]=DESC
```

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Main Warehouse",
      "code": "WH001",
      "phone": "+1234567890",
      "email": "warehouse@example.com",
      "address": "123 Main St",
      "description": "Primary warehouse",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get All Warehouses

**Endpoint**: `GET /warehouse/all`

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Main Warehouse",
    "code": "WH001",
    "phone": "+1234567890",
    "email": "warehouse@example.com",
    "address": "123 Main St",
    "description": "Primary warehouse"
  }
]
```

### Get Warehouse by ID

**Endpoint**: `GET /warehouse/:id`

**Path Parameters**:
- `id`: Warehouse UUID

**Response**:
```json
{
  "id": "uuid",
  "name": "Main Warehouse",
  "code": "WH001",
  "phone": "+1234567890",
  "email": "warehouse@example.com",
  "address": "123 Main St",
  "description": "Primary warehouse",
  "racks": [
    {
      "id": "uuid",
      "name": "Rack A1",
      "variantIds": ["variant-uuid-1", "variant-uuid-2"]
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create Warehouse

**Endpoint**: `POST /warehouse`

**Request Body**:
```json
{
  "name": "New Warehouse",
  "code": "WH002",
  "phone": "+1234567890",
  "email": "new@example.com",
  "address": "456 Oak St",
  "description": "Secondary warehouse"
}
```

**Validation Rules**:
- `name`: Required, string
- `code`: Required, string, unique
- `phone`: Required, string
- `email`: Required, valid email format
- `address`: Required, string
- `description`: Optional, string

**Response**:
```json
{
  "id": "uuid",
  "name": "New Warehouse",
  "code": "WH002",
  "phone": "+1234567890",
  "email": "new@example.com",
  "address": "456 Oak St",
  "description": "Secondary warehouse",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Warehouse

**Endpoint**: `PUT /warehouse/:id`

**Path Parameters**:
- `id`: Warehouse UUID

**Request Body** (all fields optional):
```json
{
  "name": "Updated Warehouse Name",
  "code": "WH002-UPDATED",
  "phone": "+0987654321",
  "email": "updated@example.com",
  "address": "789 Pine St",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Updated Warehouse Name",
  "code": "WH002-UPDATED",
  "phone": "+0987654321",
  "email": "updated@example.com",
  "address": "789 Pine St",
  "description": "Updated description",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### Delete Warehouse

**Endpoint**: `DELETE /warehouse/:id`

**Path Parameters**:
- `id`: Warehouse UUID

**Response**:
```json
{
  "message": "Warehouse with ID uuid deleted successfully"
}
```

## Inventory Management

### List Inventory with Pagination

**Endpoint**: `GET /warehouse/inventory`

**Query Parameters**:
- `limit` (optional): Number of items per page (default: 10)
- `page` (optional): Page number (default: 1)
- `warehouseId` (optional): Filter by warehouse ID
- `variantId` (optional): Filter by variant ID
- `unitId` (optional): Filter by unit ID
- `status` (optional): Filter by status (AVAILABLE, RESERVED, DAMAGED, EXPIRED)

**Example Request**:
```bash
GET /warehouse/inventory?warehouseId=uuid&status=AVAILABLE&limit=20
```

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "warehouseId": "warehouse-uuid",
      "variantId": "variant-uuid",
      "unitId": "unit-uuid",
      "quantity": 100,
      "status": "AVAILABLE",
      "batch": "BATCH-20240101-001",
      "expirationDate": "2024-12-31T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### Get Inventory by ID

**Endpoint**: `GET /warehouse/inventory/:id`

**Path Parameters**:
- `id`: Inventory UUID

**Response**:
```json
{
  "id": "uuid",
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 100,
  "status": "AVAILABLE",
  "batch": "BATCH-20240101-001",
  "expirationDate": "2024-12-31T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Get Inventory by Variant

**Endpoint**: `GET /warehouse/inventory/variant/:variantId`

**Path Parameters**:
- `variantId`: Variant UUID

**Response**:
```json
[
  {
    "id": "uuid",
    "warehouseId": "warehouse-uuid",
    "variantId": "variant-uuid",
    "unitId": "unit-uuid",
    "quantity": 100,
    "status": "AVAILABLE",
    "batch": "BATCH-20240101-001",
    "expirationDate": "2024-12-31T00:00:00Z"
  }
]
```

### Create Inventory

**Endpoint**: `POST /warehouse/inventory`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 100,
  "status": "AVAILABLE",
  "batch": "BATCH-20240101-001",
  "expirationDate": "2024-12-31T00:00:00Z"
}
```

**Validation Rules**:
- `warehouseId`: Required, valid UUID
- `variantId`: Required, valid UUID
- `unitId`: Required, valid UUID
- `quantity`: Required, number >= 0
- `status`: Optional, enum (AVAILABLE, RESERVED, DAMAGED, EXPIRED)
- `batch`: Optional, string
- `expirationDate`: Optional, ISO date string

### Update Inventory

**Endpoint**: `PUT /warehouse/inventory/:id`

**Path Parameters**:
- `id`: Inventory UUID

**Request Body** (all fields optional):
```json
{
  "quantity": 150,
  "status": "RESERVED",
  "batch": "BATCH-20240101-002",
  "expirationDate": "2025-01-01T00:00:00Z"
}
```

### Delete Inventory

**Endpoint**: `DELETE /warehouse/inventory/:id`

**Path Parameters**:
- `id`: Inventory UUID

**Response**:
```json
{
  "message": "Inventory with ID uuid deleted successfully"
}
```

## Inventory Operations

### Check In Inventory

**Endpoint**: `POST /warehouse/inventory/check-in`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 50,
  "status": "AVAILABLE",
  "batch": "BATCH-20240101-003",
  "expirationDate": "2024-12-31T00:00:00Z"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "warehouseId": "warehouse-uuid",
    "variantId": "variant-uuid",
    "unitId": "unit-uuid",
    "quantity": 50,
    "status": "AVAILABLE",
    "batch": "BATCH-20240101-003",
    "expirationDate": "2024-12-31T00:00:00Z"
  }
}
```

### Check Out Inventory

**Endpoint**: `POST /warehouse/inventory/check-out`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 25,
  "status": "AVAILABLE"
}
```

### Transfer Inventory

**Endpoint**: `POST /warehouse/inventory/transfer`

**Request Body**:
```json
{
  "fromWarehouseId": "source-warehouse-uuid",
  "toWarehouseId": "target-warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 30,
  "status": "AVAILABLE"
}
```

### Adjust Inventory

**Endpoint**: `POST /warehouse/inventory/adjust`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "adjustmentQuantity": 10,
  "reason": "Stock correction",
  "notes": "Found additional stock during audit"
}
```

### Write Off Inventory

**Endpoint**: `POST /warehouse/inventory/write-off`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "quantity": 5,
  "reason": "Damaged goods",
  "notes": "Items damaged during transport"
}
```

### Physical Count Adjustment

**Endpoint**: `POST /warehouse/inventory/physical-count`

**Request Body**:
```json
{
  "warehouseId": "warehouse-uuid",
  "variantId": "variant-uuid",
  "unitId": "unit-uuid",
  "physicalCount": 95,
  "reason": "Monthly inventory count",
  "notes": "Discrepancy found during physical count"
}
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be a valid email"
  ],
  "error": "Bad Request"
}
```

### Not Found Error (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Warehouse with ID uuid not found",
  "error": "Not Found"
}
```

### Business Logic Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": "Insufficient quantity available",
  "error": "Bad Request"
}
```

## Status Codes

- `200 OK`: Successful GET, PUT requests
- `201 Created`: Successful POST requests
- `400 Bad Request`: Validation errors or business logic violations
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

## Data Types

### Inventory Status Enum
- `AVAILABLE`: Available for use
- `RESERVED`: Reserved for specific orders
- `DAMAGED`: Damaged and not usable
- `EXPIRED`: Past expiration date

### Date Format
All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### UUID Format
All IDs are UUIDs in the format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 1000 requests per hour per IP
- 100 requests per minute per authenticated user

## Pagination

All list endpoints support pagination with the following parameters:
- `limit`: Number of items per page (1-100, default: 10)
- `page`: Page number (1-based, default: 1)

Response includes pagination metadata:
- `total`: Total number of items
- `page`: Current page number
- `limit`: Items per page
- `totalPages`: Total number of pages
