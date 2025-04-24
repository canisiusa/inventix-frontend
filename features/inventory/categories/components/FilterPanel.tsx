import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/store/category.store";
import { FilterOperator } from "@/lib/schemas/category.schemas";


const FilterPanel = () => {
  const { filterOptions, setFilterOptions } = useCategoryStore();
  const [operator, setOperator] = useState<FilterOperator | "none">(
    filterOptions.productCountFilter?.operator || "none"
  );
  const [value1, setValue1] = useState<string>(
    filterOptions.productCountFilter?.value1.toString() || ""
  );
  const [value2, setValue2] = useState<string>(
    filterOptions.productCountFilter?.value2?.toString() || ""
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({ search: e.target.value });
  };

  const applyFilter = () => {
    if (operator === "none") {
      setFilterOptions({ productCountFilter: null });
      return;
    }

    const val1 = parseInt(value1);
    if (isNaN(val1)) return;

    if (operator === "between") {
      const val2 = parseInt(value2);
      if (isNaN(val2)) return;

      setFilterOptions({
        productCountFilter: {
          operator,
          value1: val1,
          value2: val2,
        },
      });
    } else {
      setFilterOptions({
        productCountFilter: {
          operator,
          value1: val1,
        },
      });
    }
  };

  const clearFilters = () => {
    setOperator("none");
    setValue1("");
    setValue2("");
    setFilterOptions({
      search: "",
      productCountFilter: null,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        {/* Recherche par nom */}
        <div className="w-full md:w-1/3">
          <Label htmlFor="search">Recherche par nom</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Rechercher une catégorie..."
              className="pl-8"
              value={filterOptions.search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Filtre par nombre de produits */}
        <div className="flex flex-wrap gap-2 items-end w-full md:w-2/3">
          <div className="w-full sm:w-auto">
            <Label htmlFor="operator">Nombre de produits</Label>
            <Select
              value={operator}
              onValueChange={(val) => setOperator(val as FilterOperator | "none")}
            >
              <SelectTrigger id="operator" className="w-[160px]">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun filtre</SelectItem>
                <SelectItem value="equal">Égal à</SelectItem>
                <SelectItem value="lessThan">Inférieur à</SelectItem>
                <SelectItem value="greaterThan">Supérieur à</SelectItem>
                <SelectItem value="between">Entre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operator !== "none" && (
            <>
              <div className="w-[100px]">
                <Input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  min="0"
                  placeholder={
                    operator === "between" ? "Minimum" : "Valeur"
                  }
                />
              </div>

              {operator === "between" && (
                <>
                  <span className="self-center">et</span>
                  <div className="w-[100px]">
                    <Input
                      type="number"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                      min="0"
                      placeholder="Maximum"
                    />
                  </div>
                </>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={applyFilter}
                className="h-10"
              >
                <Filter className="h-4 w-4 mr-1" />
                Appliquer
              </Button>
            </>
          )}

          {(filterOptions.search || filterOptions.productCountFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-10 ml-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
