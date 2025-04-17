/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import StockCard from './StockCard';
import AppInput from '@/components/inputs/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, LucideFolderSymlink, Search, Plus, FileDown } from 'lucide-react';
import { getLowStockProducts, GetProducts, getProducts } from '@/lib/api/productsApi';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { ProductFormProps, showProductForm } from '@/components/modals/ProductForm';
import { ProductFilterModalProps, showProductFilterModal } from '@/components/modals/ProductFilterModal';

export const categories: Category[] = [
  { id: 'c1', name: 'Viandes', color: '#EF4444' },
  { id: 'c2', name: 'Poissons', color: '#3B82F6' },
  { id: 'c3', name: 'Fruits', color: '#F59E0B' },
  { id: 'c4', name: 'Légumes', color: '#22C55E' },
  { id: 'c5', name: 'Produits laitiers', color: '#8B5CF6' },
  { id: 'c6', name: 'Épicerie', color: '#EC4899' },
  { id: 'c7', name: 'Boissons', color: '#06B6D4' },
];
export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Filet de bœuf',
    category: 'c1',
    unit: 'kg',
    currentStock: 15,
    minimumStock: 5,
    price: 28.50,
    expiryDate: '2023-10-15',
    supplierId: 's1',
    stock: 15,
  },
  {
    id: 'p2',
    name: 'Saumon frais',
    category: 'c2',
    unit: 'kg',
    currentStock: 7,
    minimumStock: 3,
    price: 22.75,
    expiryDate: '2023-10-05',
    supplierId: 's2',
    stock: 7,
  },
  {
    id: 'p3',
    name: 'Tomates',
    category: 'c4',
    unit: 'kg',
    currentStock: 25,
    minimumStock: 10,
    price: 3.99,
    expiryDate: '2023-10-10',
    supplierId: 's3',
    stock: 25,
  },
  {
    id: 'p4',
    name: 'Laitue',
    category: 'c4',
    unit: 'pièce',
    currentStock: 2,
    minimumStock: 5,
    price: 1.50,
    expiryDate: '2023-10-04',
    supplierId: 's3',
    stock: 2,
  },
  {
    id: 'p5',
    name: 'Poulet fermier',
    category: 'c1',
    unit: 'kg',
    currentStock: 12,
    minimumStock: 4,
    price: 12.99,
    expiryDate: '2023-10-12',
    supplierId: 's1',
    stock: 12,
  },
  {
    id: 'p6',
    name: 'Cabillaud',
    category: 'c2',
    unit: 'kg',
    currentStock: 4,
    minimumStock: 2,
    price: 18.50,
    expiryDate: '2023-10-06',
    supplierId: 's2',
    stock: 4,
  },
  {
    id: 'p7',
    name: 'Pommes',
    category: 'c3',
    unit: 'kg',
    currentStock: 30,
    minimumStock: 15,
    price: 2.79,
    expiryDate: '2023-10-20',
    supplierId: 's3',
    stock: 30,
  },
  {
    id: 'p8',
    name: 'Carottes',
    category: 'c4',
    unit: 'kg',
    currentStock: 20,
    minimumStock: 8,
    price: 1.99,
    expiryDate: '2023-10-25',
    supplierId: 's3',
    stock: 20,
  },
  {
    id: 'p9',
    name: 'Huile d\'olive',
    category: 'c6',
    unit: 'litre',
    currentStock: 8,
    minimumStock: 3,
    price: 9.95,
    supplierId: 's4',
    stock: 8,
  },
  {
    id: 'p10',
    name: 'Sel de mer',
    category: 'c6',
    unit: 'kg',
    currentStock: 5,
    minimumStock: 2,
    price: 4.50,
    supplierId: 's4',
    stock: 5,
  },
];
type ExtendedQuery<TExtra = object> = GetProducts & TExtra;

const InventoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [query, setquery] = useState<ExtendedQuery<{
    threshold?: number;
    startDate?: Date
    endDate?: Date
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
        //
      } else if (activeIndex === "outOfStock") {
        response = await getLowStockProducts(query)
      }
      if (response.status === 'success') {
        setProducts(response.data.data);
      } else {
        throw response.data.data
      }
    } catch (error) {
      handleError({ error, message: "Une erreur s'est produite lors du chargement des produits.", dict: t })
    }
  };
  useEffect(() => {
    setProducts(initialProducts)
    fetchProducts();
  }, [query]);

  // Apply filters when category or search query changes
  useEffect(() => {
    setquery((prev) => ({ ...prev, page: 1, limit: 100 }))
    // Filter by category
    if (selectedCategory !== 'all') {
      setquery((prev) => ({ ...prev, categoryId: selectedCategory }))
    } else {
      setquery((prev) => ({ ...prev, categoryId: undefined }))
    }

    // Filter by search query
    if (searchQuery) {
      setquery((prev) => ({ ...prev, search: searchQuery }))
    }

  }, [selectedCategory, searchQuery, activeIndex]);


  const handleEditProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    await showProductForm({ product: product } as ProductFormProps)
  };


  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    const productName = products.find(p => p.id === productToDelete)?.name || '';

    // Filter out the product to delete
    const updatedProducts = products.filter(product => product.id !== productToDelete);
    setProducts(updatedProducts);

    // Reset state
    setShowDeleteDialog(false);
    setProductToDelete(null);

    toast({
      title: "Produit supprimé",
      description: `${productName} a été supprimé de l'inventaire.`
    });
  };

  const handleAddStock = (productId: string) => {
    // In a real app, this would open a form to add stock
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          currentStock: product.currentStock + 1
        };
      }
      return product;
    });

    setProducts(updatedProducts);

    toast({
      title: "Stock mis à jour",
      description: "1 unité ajoutée au stock."
    });
  };

  const handleRemoveStock = (productId: string) => {
    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product || product.currentStock <= 0) return;

    // Update the product
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          currentStock: p.currentStock - 1
        };
      }
      return p;
    });

    setProducts(updatedProducts);

    toast({
      title: "Stock mis à jour",
      description: "1 unité retirée du stock."
    });
  };

  const handleExportCSV = () => {
    // Convert products to CSV
    const headers = ['Nom', 'Catégorie', 'Unité', 'Stock actuel', 'Stock minimal', 'Prix', 'Date d\'expiration', 'Fournisseur'];
    const rows = products.map(product => {
      const category = categories.find(c => c.id === product.category)?.name || '';

      return [
        product.name,
        category,
        product.unit,
        product.currentStock,
        product.minimumStock,
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
                  {initialProducts.length}
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
                      threshold: value.threshold,
                      startDate: value.startDate,
                      endDate: value.endDate
                    }})

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
                    showProductForm({ product: undefined } as ProductFormProps)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='!gap-3'
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();

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

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <StockCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={confirmDelete}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé de l&apos;inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryProducts;
