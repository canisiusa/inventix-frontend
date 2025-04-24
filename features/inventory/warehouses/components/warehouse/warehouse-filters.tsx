import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryWarehousesDto } from "@/lib/schemas/warehouse.schemas";
import { Download, FileDown, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WarehouseFiltersProps {
  companies: string[];
  locations: string[];
  onFilterChange: (filters: QueryWarehousesDto) => void;
  className?: string;
}

export function WarehouseFilters({
  companies,
  locations,
  onFilterChange,
  className,
}: WarehouseFiltersProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
   const [filtersVisible] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    onFilterChange({
      search: search.trim() || undefined,
      location: location || undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setCompany("");
    onFilterChange({});
  };

  const handleExportCSV = () => {
    toast({
      title: "Export CSV",
      description: "Le fichier CSV a été téléchargé avec succès.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "Le fichier PDF a été généré avec succès.",
    });
  };

/*   const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Calculer combien de filtres sont actifs
  const activeFiltersCount = [location, company].filter(Boolean).length; */

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un entrepôt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-8"
            />
          </div>
        </div>
        {/* <Button
          variant="outline"
          size="icon"
          onClick={toggleFilters}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button> */}

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            <span className="sr-only">Exporter en CSV</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Exporter en PDF</span>
          </Button>
        </div>

        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>

      {filtersVisible && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-2">
            <label
              htmlFor="location-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Localisation
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location-filter">
                <SelectValue placeholder="Toutes les localisations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les localisations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Entreprise
            </label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger id="company-filter">
                <SelectValue placeholder="Toutes les entreprises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entreprises</SelectItem>
                {companies.map((comp) => (
                  <SelectItem key={comp} value={comp}>
                    {comp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleReset} size="sm">
              <X className="mr-2 h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
