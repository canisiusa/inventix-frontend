/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import StockCard from './StockCard';
import AppInput from '@/components/inputs/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, LucideFolderSymlink, Search, Plus, FileDown } from 'lucide-react';
import { deleteProduct, getLowStockProducts, GetProducts, getProducts, getTopSellingProducts } from '@/lib/api/productsApi';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { ProductFormProps, showProductFormModal } from '@/components/modals/ProductForm';
import { ProductFilterModalProps, showProductFilterModal } from '@/components/modals/ProductFilterModal';
import { useCategoryStore } from '@/store/category.store';
import { AddStockMovementModalProps, showAddStockMovementModal } from '@/components/modals/add-movement-modal';
import { GenericCombobox } from '@/components/inputs/GenericCombobox';
import { showAddCategoryModal } from '@/components/modals/CategoryModal';
import { ConfirmActionModalProps, showConfirmModal } from '@/components/modals/ActionConfirm';
import { useDebounce } from '@/hooks/use-debounce';


type ExtendedQuery<TExtra = object> = GetProducts & TExtra;

const InventoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const categories = useCategoryStore((state) => state.categories);

  const [query, setquery] = useState<ExtendedQuery<{
    threshold?: number;
    startDate?: Date;
    endDate?: Date;
    minSales?: number;
  }>>({
    page: 1,
    limit: 100,
  })

  const [activeIndex, setactiveIndex] = useState<"all" | "topSelling" | "outOfStock">("all")
  const { t } = useLocalization()


  const fetchProducts = async () => {
    try {
      let response: any;
      if (activeIndex === "all") {
        response = await getProducts(query)
      } else if (activeIndex === "topSelling") {
        response = await getTopSellingProducts(query)
      } else if (activeIndex === "outOfStock") {
        response = await getLowStockProducts(query)
      }
      setProducts(response.data);

    } catch (error) {
      handleError({ error, message: "Une erreur s'est produite lors du chargement des produits.", dict: t })
    }
  };
  useEffect(() => {
    setProducts([])
    fetchProducts();
  }, [query]);

  useEffect(() => {
    setquery(prev => {
      // On reconstruit tout l'objet d'un coup
      const next: typeof prev = {
        ...prev,
        page: 1,
        limit: 100,
        categoryId: selectedCategory?.id,
      };

      // Si on avait déjà un search, ou si on a un nouveau debouncedSearch,
      // on l'ajoute (même vide pour effacer l'ancien)
      if (debouncedSearch.trim() || (prev.search && !debouncedSearch.trim())) {
        next.search = debouncedSearch;
      }

      return next;
    });
  }, [selectedCategory, debouncedSearch, activeIndex]);

  const handleEditProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    await showProductFormModal({ product: product } as ProductFormProps)
  };


  const handleDeleteProduct = async (productId: string) => {
    try {
      await showConfirmModal({
        isOpen: true,
        message: "Cette action est irréversible. Le produit sera définitivement supprimé de l'inventaire.",
        title: "Êtes-vous sûr?",
        okText: "Supprimer",
        cancelText: "Annuler",
      } as ConfirmActionModalProps)
      await deleteProduct(productId);
      const productName = products.find(p => p.id === productId)?.name || '';

      // Filter out the product to delete
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);

      toast({
        title: "Produit supprimé",
        description: `${productName} a été supprimé de l'inventaire.`
      });
    } catch (error) {
      handleError({ error, message: "Une erreur s'est produite lors de la suppression du produit.", dict: t })
    }
  };

  const handleAddStock = async (stock: Stock) => {
    const updatedData: StockMovement = await showAddStockMovementModal({
      isOpen: true,
      stock: stock,
      type: "IN"
    } as AddStockMovementModalProps)
    if (!updatedData) return;
    // Find the product
    const product = products.find(p => p.id === stock.productId);
    if (!product) return;
    // Update the product
    const updatedProducts = products.map(p => {
      if (p.id === stock.productId) {
        return {
          ...p,
          stock: {
            ...updatedData.stock,
          }
        };
      }
      return p;
    });
    // Update the state
    setProducts(updatedProducts);
  };

  const handleRemoveStock = async (stock: Stock) => {
    const updatedData: StockMovement = await showAddStockMovementModal({
      isOpen: true,
      stock: stock,
      type: "OUT"
    } as AddStockMovementModalProps)
    if (!updatedData) return;
    // Find the product
    const product = products.find(p => p.id === stock.productId);
    if (!product) return;
    // Update the product
    const updatedProducts = products.map(p => {
      if (p.id === stock.productId) {
        return {
          ...p,
          stock: {
            ...updatedData.stock,
          }
        };
      }
      return p;
    });
    // Update the state
    setProducts(updatedProducts);
  };

  const handleExportCSV = () => {
    // Convert products to CSV
    const headers = ['Nom', 'Catégorie', 'Unité', 'Stock actuel', 'Stock minimal', 'Prix', 'Date d\'expiration', 'Fournisseur'];
    const rows = products.map(product => {
      const category = categories.find(c => c.id === product.category.id)?.name || '';

      return [
        product.name,
        category,
        product.unit,
        product.stock?.quantity,
        product.stock?.minimumStock,
        product.price.toFixed(2),
        product.expiryDate || '',
        product.supplierId
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventaire.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: "L'inventaire a été exporté au format CSV."
    });
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 p-2 bg-white flex-col justify-start items-start gap-3  rounded-t-lg  border-b-0  border-gray-200 mx-auto flex">
        <div className="self-stretch py-3 justify-start items-center gap-4 inline-flex">
          <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-0 inline-flex">
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <span className="text-lg font-semibold">Produits</span>
              <div className="px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200 justify-start items-center flex">
                <span className="text-center text-blue-700 text-xs leading-none">
                  {products.length}
                </span>
              </div>
            </div>
            <span className="self-stretch text-slate-600 text-sm w-[600px] truncate">
              Gérez  {
                activeIndex === "all" ? " tous les produits" :
                  activeIndex === "topSelling" ? " les produits les plus vendus" :
                    activeIndex === "outOfStock" ? " les produits en rupture de stock" : ""
              } de votre inventaire
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                showProductFilterModal({
                  type: activeIndex,
                  threshold: query.threshold,
                  startDate: query.startDate,
                  endDate: query.endDate,
                } as ProductFilterModalProps).then((value) => {
                  setactiveIndex(value.type)
                  setquery((old) => {
                    return {
                      ...old,
                      minSales: value?.minSales,
                      startDate: value?.dateRange?.startDate,
                      endDate: value?.dateRange?.endDate
                    }
                  })

                });
              }}
            >
              <Filter
                fill="transparent"
                stroke="gray"
                width={20}
                height={20}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="!shadow-none">
                <Button
                  variant="default"
                >
                  <Plus
                    stroke="white"
                    fill="transparent"
                    width={20}
                    height={20}
                  />
                  Ajouter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>

                <DropdownMenuItem
                  className='!gap-3'
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    showProductFormModal({ product: undefined } as ProductFormProps)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='!gap-3'
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    showAddCategoryModal()
                  }}
                >
                  <LucideFolderSymlink
                  />
                  Créer une catégorie
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='!gap-3'
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    handleExportCSV()
                  }}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Exporter CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <AppInput
            placeholder="Rechercher un produit"
            defaultValue={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            inputContainerClassName="size-9 w-full"
            inputClassName='!text-xs'
            variant="primary"
            prefixContent={
              <Search
                fill="transparent"
                stroke="currentColor"
                width={18}
                height={18}
              />
            }
          />

          <GenericCombobox
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            labelKey="name"
            valueKey="id"
            placeholder='Toutes les catégories'
            className='w-52'
          />
        </div>
      </div>


      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <StockCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAddStock={handleAddStock}
              onRemoveStock={handleRemoveStock}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Aucun produit trouvé</h3>
          <p className="text-gray-500 mt-2">
            Aucun produit ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryProducts;
