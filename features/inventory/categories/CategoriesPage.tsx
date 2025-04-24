"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import AppTable from "@/components/misc/table";
import { Download, Plus } from "lucide-react";
import FilterPanel from "./components/FilterPanel";
import { useCategoryStore } from "@/store/category.store";
import { showAddCategoryModal } from "@/components/modals/CategoryModal";
import { updateCategory, deleteCategory } from "@/lib/api/categoryApi";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import EmptyStateUI from "@/components/misc/emptystate";


export default function CategoryManager() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setloading] = useState(false)
  const { categories, getFilteredCategories, updateCategory: update, deleteCategory: deleteCat } = useCategoryStore();
  const filteredCategories = getFilteredCategories();
  const { t } = useLocalization();


  const handleUpdate = async (id: string, data: Category) => {
    try {
      setloading(true)
      const result = await updateCategory(id, data);
      update(id, result);
      setEditingId(null);
      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie ${data.name} a été mise à jour.`,
      });
    } catch (error) {
      handleError({ error, message: "Erreur lors de la mise à jour de la catégorie", dict: t })
    } finally {
      setloading(false)
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setloading(true)
      await deleteCategory(id);
      deleteCat(id);

      toast({
        title: "Catégorie supprimée",
        description: `La catégorie a été supprimée avec succès.`,
      });

    } catch (error) {
      handleError({ error, message: "Erreur lors de la suppression de la catégorie", dict: t })
    } finally {
      setloading(false)
    }
  };

  const exportCSV = () => {
    const headers = ["Nom", "Couleur", "Nombre de produits"];
    const rows = categories.map((c) => [c.name, c.color, c._count.products]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "categories.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des catégories</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={filteredCategories.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Button
            onClick={() => showAddCategoryModal({ isOpen: true })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une catégorie
          </Button>
        </div>
      </div>
      <FilterPanel />

      <AppTable
        header={<TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Couleur</TableHead>
          <TableHead>Produits</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>}
        body={
          <>
            {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input defaultValue={cat.name} onChange={(e) => cat.name = e.target.value} />
                  ) : cat.name}
                </TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input defaultValue={cat.color} type="color" onChange={(e) => cat.color = e.target.value} />
                  ) : <span className="px-2 py-1 rounded" style={{ backgroundColor: cat.color }}>{cat.color}</span>}
                </TableCell>
                <TableCell>{cat._count.products}</TableCell>
                <TableCell className="flex gap-2">
                  {editingId === cat.id ? (
                    <>
                      <Button size="sm" loading={loading} onClick={() => handleUpdate(cat.id, cat)}>Valider</Button>
                      <Button size="sm" loading={loading} variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(cat.id)}>Éditer</Button>
                      <Button size="sm" loading={loading} variant="destructive" onClick={() => handleDelete(cat.id)}>Supprimer</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            )) :
              <tr>
                <td colSpan={6}>
                  <div>
                    <EmptyStateUI title="Aucune catégorie trouvée" />
                  </div>
                </td>
              </tr>
            }
          </>
        }
      />

    </div>
  );
}
