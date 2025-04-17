import { getCategories } from "@/lib/api/categoryApi";
import { FilterOptions } from "@/lib/schemas/category.schemas";
import { create } from "zustand";

interface CategoryState {
  categories: Category[];
  filterOptions: FilterOptions;
  loading: boolean;
  
  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "_count">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  
  // Derived state
  getFilteredCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  filterOptions: {
    search: "",
    productCountFilter: null,
  },
  loading: false,
  
  // Actions
  fetchCategories: async () => {
    try {
      set({ loading: true });
      const response = await getCategories();
      set({ categories: response });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    } finally {
      set({ loading: false });
    }
  },
  addCategory: (categoryData) => {
    const newCategory = {
      ...categoryData,
      _count: { products: 0 },
    };
    
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
  },
  
  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    }));
  },
  
  deleteCategory: (id) => {
    const category = get().categories.find((c) => c.id === id);
    
    if (!category) {
      return { success: false, message: "Catégorie non trouvée" };
    }
    
    if (category._count.products > 0) {
      return {
        success: false,
        message: "Impossible de supprimer cette catégorie : des produits y sont associés.",
      };
    }
    
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    
    return { success: true };
  },

  
  setFilterOptions: (options) => {
    set((state) => ({
      filterOptions: { ...state.filterOptions, ...options },
    }));
  },
  
  // Derived state
  getFilteredCategories: () => {
    const { categories, filterOptions } = get();
    let filtered = [...categories];
    
    // Filtrer par nom
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrer par nombre de produits
    if (filterOptions.productCountFilter) {
      const { operator, value1, value2 } = filterOptions.productCountFilter;
      
      filtered = filtered.filter((category) => {
        const count = category._count.products;
        
        switch (operator) {
          case "equal":
            return count === value1;
          case "lessThan":
            return count < value1;
          case "greaterThan":
            return count > value1;
          case "between":
            return value2 !== undefined && count >= value1 && count <= value2;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  },
}));
