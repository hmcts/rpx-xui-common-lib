export interface Pagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
}

export interface PaginationParameter {
  page_number: number;
  page_size: number;
}
