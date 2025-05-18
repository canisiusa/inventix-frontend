import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContainerProps, create } from "react-modal-promise";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user.store";
import { Input } from "@/components/ui/input";
import { useReactToPrint } from "react-to-print";
import { useUpdateSupplierOrder } from "../hooks/useSupplierOrders";

type LigneProduit = {
  productId: string;
  unitPrice: number;
  nomProduit: string;
  quantite: number;
  sku: string;
};

export interface PurchaseOrderBuilderProps extends ContainerProps {
  isOpen: boolean;
  supplier?: Supplier;
  orderId?: string;
  onResolve: (value: string) => void;
  lignesProduit?: LigneProduit[];
};

function PurchaseOrderBuilder({
  lignesProduit = [],
  supplier,
  ...props
}: PurchaseOrderBuilderProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const [tvaRate, setTvaRate] = useState<number>(currentUser?.company?.tva || 18);
  const [prixUnitaires, setPrixUnitaires] = useState<number[]>(
    lignesProduit.map((p) => p.unitPrice || 0) || []
  );

  const [infos] = useState({
    buyerName: currentUser?.company.name || "",
    buyerAddress: currentUser?.company.address || "",
    supplierName: supplier?.name || "",
    supplierAddress: supplier?.address || "",
    orderNumber: "BC-2025-001",
    date: new Date().toISOString().split("T")[0],
  });

  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { updateOrder, isSubmitting } = useUpdateSupplierOrder();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrixChange = (i: number, value: string) => {
    const newValues = [...prixUnitaires];
    newValues[i] = parseFloat(value) || 0;
    setPrixUnitaires(newValues);
  };

  const totalHT = lignesProduit.reduce((sum, ligne, i) => {
    return sum + ligne.quantite * (prixUnitaires[i] || 0);
  }, 0);

  const tva = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + tva;

  const reactToPrintFn = useReactToPrint({ contentRef });

  const generateAndUploadPDF = async () => {
    try {
      updateOrder(props.orderId!, {
        products: lignesProduit.map((ligne, i) => ({
          productId: ligne.productId,
          quantity: ligne.quantite,
          unitPrice: prixUnitaires[i] || 0,
        }))
      }, {
        onSuccess: () => {
          reactToPrintFn();
          props.onResolve("PDF generated successfully");
        },
        onError: (error) => {
          props?.onReject?.("Error generating PDF " + error);
        }
      });
    } catch {
    }
  };

  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="max-w-4xl p-6 max-h-[80vh] overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Bon de commande</h1>
        <div className="grid grid-cols-2 gap-6 mb-4 mx-auto">
          <div className="flex flex-col">
            <label htmlFor="tva" className="mb-1 text-sm font-medium text-gray-700">
              Taux de TVA (%)
            </label>
            <Input
              id="tva"
              type="number"
              placeholder="Ex : 20"
              value={tvaRate}
              onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="logo-upload" className="mb-1 text-sm font-medium text-gray-700">
              Logo de l&apos;entreprise
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
            />
          </div>
        </div>


        {/* Aperçu */}
        <div ref={contentRef} className="bg-white p-8 text-[13px] border leading-relaxed font-sans w-[794px] mx-auto">
          <div className="flex items-center justify-between w-full mb-6">
            {logoBase64 && <img src={logoBase64} alt="Logo" className="h-16  overflow-hidden" />}
            <h2 className="text-center text-xl font-bold">BON DE COMMANDE</h2>
            <div>
              <p className="mb-1 font-bold text-xs"> #{infos.orderNumber}</p>
              <p className="font-light text-xs">Date : {infos.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-6 text-sm">
            <div>
              <p className="font-semibold uppercase">Commande émise par :</p>
              <p>{infos.buyerName}</p>
              <p className="mb-2">{infos.buyerAddress}</p>
              <p>{currentUser?.company.phone}</p>
              <p>{currentUser?.company.email}</p>
            </div>
            <div>
              <p className="font-semibold uppercase text-right">Fournisseur :</p>
              <p className="text-right">{infos.supplierName}</p>
              <p className="mb-2 text-right">{infos.supplierAddress}</p>
              <p className="text-right">{supplier?.phone}</p>
              <p className="text-right">{supplier?.email}</p>
            </div>
          </div>

          <table className="w-full table-fixed border-collapse border border-gray-400 text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Ref Produit</th>
                <th className="border p-2">Désignation</th>
                <th className="border p-2 w-20">Qté</th>
                <th className="border p-2 w-32">Prix unitaire ({currentUser?.company.currency})</th>
                <th className="border p-2 w-32">Total ({currentUser?.company.currency})</th>
              </tr>
            </thead>
            <tbody>
              {lignesProduit.map((ligne, i) => (
                <tr key={i}>
                  <td className="border p-2">{ligne.sku}</td>
                  <td className="border p-2">{ligne.nomProduit}</td>
                  <td className="border p-2 text-center">{ligne.quantite}</td>
                  <td className="border p-2 text-center">
                    <input
                      className="w-full border-none px-2 py-1 text-right"
                      type="number"
                      autoFocus
                      value={prixUnitaires[i]}
                      onChange={(e) => handlePrixChange(i, e.target.value)}
                    />
                  </td>
                  <td className="border p-2 text-right">
                    {(ligne.quantite * (prixUnitaires[i] || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mb-4">
            <p>Total HT : {totalHT.toFixed(2)} {currentUser?.company.currency}</p>
            <p>TVA ({tvaRate}%) : {tva.toFixed(2)} {currentUser?.company.currency}</p>
            <p className="font-bold">Total TTC : {totalTTC.toFixed(2)} {currentUser?.company.currency}</p>
          </div>
          <div className="h-48 border rounded"></div>

          <div className="flex justify-between pt-4">
            <p className=" border-b pb-16 font-semibold">Signature de l’acheteur</p>
            <p className=" border-b pb-16 font-semibold">Signature du fournisseur</p>
          </div>
        </div>

        <div className="flex w-full items-center justify-end mt-4 gap-4">
          <Button
            variant="outline"
            onClick={() => props?.onReject?.("")}
          >
            Fermer
          </Button>
          <Button
            onClick={generateAndUploadPDF}
            loading={isSubmitting}
            disabled={lignesProduit.length === 0 || prixUnitaires.some((prix) => prix <= 0)}
          >
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const showPurchaseOrderBuilder = create(PurchaseOrderBuilder)