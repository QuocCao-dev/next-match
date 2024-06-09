import { create } from "zustand";
import { PagingResult } from "@/types";
import { devtools } from "zustand/middleware";

type PaginationState = {
  pagination: PagingResult;
  setPagination: (count: number) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
};

const usePaginationStore = create<PaginationState>()(
  devtools(
    (set) => ({
      pagination: {
        pageNumber: 1,
        pageSize: 12,
        totalPages: 0,
        totalCount: 1,
      },
      setPagination: (totalCount: number) =>
        set((state) => ({
          pagination: {
            pageNumber: 1,
            pageSize: state.pagination.pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / state.pagination.pageSize),
          },
        })),
      setPage: (page: number) =>
        set((state) => ({
          pagination: {
            ...state.pagination,
            pageNumber: page,
          },
        })),
      setPageSize: (size) =>
        set((state) => ({
          pagination: {
            ...state.pagination,
            pageSize: size,
            pageNumber: 1,
            totalPages: Math.ceil(state.pagination.totalCount / size),
          },
        })),
    }),
    { name: "PaginationStore" }
  )
);

export default usePaginationStore;
