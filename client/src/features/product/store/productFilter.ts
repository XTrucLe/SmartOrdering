import { create } from "zustand";
import { ProductSortOption } from "../types";
import { SortOrder } from "@/lib/types/sort";

interface ProductState {
    search: string;
    filters: Record<string, string[]>;
    sortBy: ProductSortOption;
    sortOrder: SortOrder;

    setSearch: (query: string) => void;
    setFilter: (filters: Record<string, string[]>) => void;
    toggleFilter: (key: string, value: string) => void;
    clearFilter: (key: string) => void;
    setSortBy: (option: ProductSortOption) => void;
    toggleSortOrder: () => void;
    reset: () => void;
}

export const useProductFilters = create<ProductState>((set) => ({
    search: "",
    filters: {},
    sortBy: "name",
    sortOrder: "asc",

    setSearch: (query) => set({ search: query }),
    setFilter: (filters) => set({ filters }),
    toggleFilter: (key, value) =>
        set((s) => {
            const currentValues = s.filters[key] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { filters: { ...s.filters, [key]: newValues } };
        }),
    clearFilter: (key) =>
        set((s) => ({
            filters: { ...s.filters, [key]: [] },
        })),
    setSortBy: (option) => set({ sortBy: option }),
    toggleSortOrder: () =>
        set((s) => ({ sortOrder: s.sortOrder === "asc" ? "desc" : "asc" })),
    reset: () =>
        set({ search: "", filters: {}, sortBy: "name", sortOrder: "asc" }),
}));
