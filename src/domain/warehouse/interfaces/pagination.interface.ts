export interface PaginationQuery {
  limit?: number;
  page?: number;
  name?: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
