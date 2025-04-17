'use client'

import AppInput from '@/components/inputs/input';
import AppTable from '@/components/misc/table';
import { Button } from '@/components/ui/button';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Delete, Download, Edit, Mail, MessageCircle, MoreHorizontal, Plus, Search, Upload, UserPlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { deleteSupplier, getSuppliers } from '@/lib/api/supplierApi';
import { useLocalization } from '@/providers/localization-provider';
import { handleError } from '@/lib/utils';
import { showSupplierModal, SupplierModalProps } from '@/components/modals/SupplierModal';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import EmptyStateUI from '@/components/misc/emptystate';
import { useDebounce } from '@/hooks/use-debounce';
import { showImportSupplierModal } from './_components/ImportSupplierModal';

const tableWidth = 900;
const columnWidths = [0.2 * tableWidth, ...Array(5).fill(0.16 * tableWidth)];

export default function SupplierPage() {

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { t } = useLocalization()
  const [paginationData, setpaginationData] = useState({
    totalPages: 0,
    total: 0,
    currentPage: 0,
    loading: false,
  },)

  const divRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast()

  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    setSuppliers([]);
    setLoading(true);
    fetchSuppliers(1);
  }, [debouncedSearch]);


  const fetchSuppliers = async (p?: number, l?: number) => {
    try {
      if (loading || paginationData.loading) return;

      const { totalPages, currentPage } = paginationData;

      if (!p &&totalPages === currentPage && currentPage !== 0) return;

      setpaginationData((old) => ({ ...old, loading: true }));

      const resp = await getSuppliers({
        search: debouncedSearch,
        limit: l ?? 100,
        page: p ? p : currentPage + 1,
      });
      if (resp.meta.currentPage === 1) {
        setSuppliers(resp.data);
        setpaginationData({
          total: resp.meta.total,
          totalPages: resp.meta.totalPages,
          currentPage: resp.meta.currentPage,
          loading: false,
        });
        return;
      }
      setSuppliers((old) => [...old, ...resp.data]);
      setpaginationData((old) => ({ ...old, ...resp.meta }))
    } catch (error) {
      handleError({ error, message: 'Erreur lors du chargement des fournisseurs', dict: t })
    } finally {
      setLoading(false);
      setpaginationData((old) => ({ ...old, loading: false }))
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const div = divRef.current;
      if (div && loading === false && paginationData.loading === false) {
        const scrollTop = div.scrollTop;
        const scrollHeight = div.scrollHeight;
        const clientHeight = div.clientHeight;

        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight * 100;

        if (scrollPercentage >= 70) {
          fetchSuppliers();
        }
      }
    };

    const div = divRef.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, paginationData.loading]);


  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const data = await deleteSupplier(id);
      if (data.status === "failure") throw data.data;
      setSuppliers((old) => old.filter((supplier) => supplier.id !== id));
      setpaginationData((old) => ({ ...old, total: old.total - 1 }))
      toast({
        title: "Fournisseur supprimé",
        description: `${data.data.name} a été supprimé avec succès`,
      });
      fetchSuppliers(1);
    } catch (error) {
      handleError({ error, message: 'Erreur lors de la suppression du fournisseur', dict: t })
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const resp = await getSuppliers({
        search,
      });
      if (resp.data.length === 0) {
        toast({
          title: "Aucun fournisseur trouvé",
          description: "Il n'y a pas de fournisseurs à exporter",
        });
        return;
      }
      const csvRows = [
        ["Nom", "Numéro", "Email", "Adresse"],
        ...resp.data.map(supplier => [
          supplier.name,
          supplier.phone || "",
          supplier.email || "",
          supplier.address || "",
        ]),
      ];

      const csvContent = csvRows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fournisseurs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      handleError({ error: e, message: "Erreur lors de l'export CSV", dict: t });
    }
  }

  return (
    <div className="p-5 w-full h-full flex flex-col gap-5">
      <div className=" w-full overflow-hidden justify-center">
        <div className=" bg-white justify-start items-start gap-5 p-3 rounded-t-lg  border-b-0  border-gray-200 mx-auto flex">
          <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-0 inline-flex">
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <span className="text-lg-semibold">Fournisseurs</span>
              <div className="px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200 justify-start items-center flex">
                <span className="text-center text-blue-700 text-xs leading-none">
                  {paginationData.total}
                </span>
              </div>
            </div>
            <span className="self-stretch text-slate-600 text-sm w-[600px] truncate">
              Gérez le carnet d&apos;adresse de vos fournisseurs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AppInput
              placeholder="Rechercher un fournisseur..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                  onClick={async () => {
                    await showSupplierModal().then(() => {
                      fetchSuppliers(1);
                    });
                  }}
                >
                  <UserPlus width={20} height={20} />
                  Ajouter un fournisseur
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => handleExport()}
                >
                  <Upload />
                  Exporter le résultat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => showImportSupplierModal()}
                >
                  <Download />
                  Importer des fournisseurs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className=' bg-white'>
          <AppTable
            scrollDivRef={divRef}
            loading={loading}
            maxHeightClassName="max-h-[calc(100vh-14rem)]"
            columnWidths={columnWidths}
            tableWidth={tableWidth}
            header={
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Addresse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            }
            body={
              <>
                {suppliers.length > 0 ? suppliers.map((supplier, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 text-sm">
                    <TableCell
                      style={{ width: `${columnWidths[0]}px` }} title={supplier.name}
                      onClick={() => {
                        navigator.clipboard.writeText(supplier.name)
                        toast({
                          title: "Nom copié",
                          description: `${supplier.name} a été copié dans le presse-papier`,
                        });
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {supplier.name}
                    </TableCell>
                    <TableCell
                      style={{ width: `${columnWidths[1]}px` }} title={supplier.phone}
                      onClick={() => {
                        navigator.clipboard.writeText(supplier.phone || "")
                        toast({
                          title: "Numéro copié",
                          description: `${supplier.phone} a été copié dans le presse-papier`,
                        });
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {supplier.phone || '-'}
                    </TableCell>
                    <TableCell
                      style={{ width: `${columnWidths[2]}px` }} title={supplier.email}
                      onClick={() => {
                        navigator.clipboard.writeText(supplier.email || "")
                        toast({
                          title: "Email copié",
                          description: `${supplier.email} a été copié dans le presse-papier`,
                        });
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {supplier.email || '-'}

                    </TableCell>
                    <TableCell
                      style={{ width: `${columnWidths[3]}px` }} title={supplier.address}
                      onClick={() => {
                        navigator.clipboard.writeText(supplier.address || "")
                        toast({
                          title: "Adresse copié",
                          description: `${supplier.address} a été copié dans le presse-papier`,
                        });
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {supplier.address || '-'}

                    </TableCell>
                    <TableCell style={{ width: `${columnWidths[4]}px` }}>
                      <Badge variant={supplier.deletedAt ? "destructive" : "secondary"}>
                        {supplier.deletedAt ? t['inactive'] : t['active']}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ width: `${columnWidths[5]}px` }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={async () => {
                              await showSupplierModal({
                                isOpen: true,
                                supplier: supplier
                              } as SupplierModalProps
                              ).then(() => {
                                fetchSuppliers(1, paginationData.currentPage * 100);
                              });
                            }}
                          >
                            <Edit />
                            {t['edit']}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500"
                            onClick={() => {
                              handleDelete(supplier.id);
                            }}
                          >
                            <Delete />
                            {t['delete']}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              window.open(`https://wa.me/${supplier.phone}`, '_blank');
                            }}
                          >
                            <MessageCircle />
                            Joindre via WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              window.open(`mailto:${supplier.email}`, '_blank');
                            }}
                          >
                            <Mail />
                            Envoyer un Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) :
                  <tr>
                    <td colSpan={6}>
                      <div>
                        <EmptyStateUI title="Aucun fournisseur trouvé" />
                      </div>
                    </td>
                  </tr>
                }
              </>
            }
          />
        </div>
      </div>
    </div>
  )
}
