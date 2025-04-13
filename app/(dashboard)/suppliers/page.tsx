'use client'

import AppInput from '@/components/inputs/input';
import AppTable from '@/components/misc/table';
import { Button } from '@/components/ui/button';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Supplier } from '@/types/entities';
import { deleteSupplier, getSuppliers } from '@/lib/server-actions/supplier.api';
import { useLocalization } from '@/providers/localization-provider';
import { handleError } from '@/lib/utils';
import { showSupplierModal, SupplierModalProps } from '@/components/modals/SupplierModal';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import EmptyStateUI from '@/components/misc/emptystate';

const tableWidth = 900;
const columnWidths = [0.2 * tableWidth, ...Array(5).fill(0.16 * tableWidth)];

const Page = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { t } = useLocalization()
  const [paginationData, setpaginationData] = useState({
    totalPages: 0,
    total: 0,
    page: 0,
    loading: false,
  },)

  const divRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast()

  const fetchSuppliers = async () => {
    try {
      const { totalPages, page, loading } = paginationData;
      if (loading) return;

      if (totalPages === page && page !== 0) {
        return null;
      }

      if (suppliers.length == 0) {
        setLoading(true);
      } else {
        setpaginationData((old) => ({ ...old, loading: true }))
      }

      const resp = await getSuppliers({
        search,
        limit: 20,
        page: page ? page + 1 : 1,
      });
      if (resp.status === "failure") throw resp.data;
      setSuppliers((old) => [...old, ...resp.data.data]);
      setpaginationData((old) => ({ ...old, page: resp.data.meta.page, totalPages: resp.data.meta.totalPages }))
    } catch (error) {
      handleError({ error, message: 'Erreur lors du chargement des fournisseurs', dict: t })
    } finally {
      setLoading(false);
      setpaginationData((old) => ({ ...old, loading: false }))
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

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
    } catch (error) {
      handleError({ error, message: 'Erreur lors de la suppression du fournisseur', dict: t })
    } finally {
      setLoading(false);
    }
  };

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
            <Button
              variant="default"
              onClick={() => {
                showSupplierModal();
              }}
            >
              <UserPlus stroke="white" fill="transparent" width={20} height={20} />
            </Button>
          </div>
        </div>

        <div className=' bg-white'>
          <AppTable
            scrollDivRef={divRef}
            loading={loading}
            maxHeightClassName="max-h-[calc(100vh-170px)]"
            columnWidths={columnWidths}
            tableWidth={tableWidth}
            header={
              <>
                <TableHead>Nom</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Addresse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </>
            }
            body={
              <>
                {suppliers.length > 0 ? suppliers.map((supplier, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 text-sm">
                    <TableCell style={{ width: `${columnWidths[0]}px` }}>{supplier.name}</TableCell>
                    <TableCell style={{ width: `${columnWidths[1]}px` }}>{supplier.phone || '-'}</TableCell>
                    <TableCell style={{ width: `${columnWidths[2]}px` }}>{supplier.email || '-'}</TableCell>
                    <TableCell style={{ width: `${columnWidths[3]}px` }} title={supplier.address}>{supplier.address || '-'}</TableCell>
                    <TableCell style={{ width: `${columnWidths[4]}px` }}>
                      <Badge variant="default">
                        {!supplier.updatedAt ? t['active'] : t['inactive']}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ width: `${columnWidths[5]}px` }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="rounded-full p-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              showSupplierModal({ isOpen: true, supplier: supplier } as SupplierModalProps);
                            }}
                          >
                            {t['edit']}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500"
                            onClick={() => {
                              handleDelete(supplier.id);
                            }}
                          >
                            {t['delete']}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              window.open(`https://wa.me/${supplier.phone}`, '_blank');
                            }}
                          >
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              window.open(`mailto:${supplier.email}`, '_blank');
                            }}
                          >
                            Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) :
                  <EmptyStateUI
                    className='py-24'
                    title="Aucun fournisseur trouvé"
                  />
                }
              </>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Page;
