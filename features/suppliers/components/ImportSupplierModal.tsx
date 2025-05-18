import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { importSuppliers } from '@/lib/api/supplierApi';
import { ContainerProps, create } from 'react-modal-promise';
import { motion } from 'framer-motion';

interface ParsedRow {
  index: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  errors: string[];
}

interface ImportSupplierModalProps extends ContainerProps {
  isOpen: boolean;
}

const ImportSupplierModal = ({ isOpen, onReject, onResolve }: ImportSupplierModalProps) => {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) handleFile(acceptedFiles[0]);
    },
  });

  const handleFile = (file: File) => {
    const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
    if (isExcel) {
      toast({ title: 'Format non pris en charge', description: 'Merci de convertir votre fichier Excel en CSV avant import.' });
      return;
    }
    Papa.parse(file, {
      skipEmptyLines: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete: ({ data }: any) => {
        const parsed: ParsedRow[] = data.slice(1).map((row: string[], i: number) => ({
          index: i,
          name: row[0] || '',
          phone: row[1] || '',
          email: row[2] || '',
          address: row[3] || '',
          status: row[4] || '',
          errors: [],
        }));
        const validated = validateRows(parsed);
        setRows(validated);
      },
    });
  };

  const validateRows = (rows: ParsedRow[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s()-]+$/;
    const seen = new Set();

    return rows.map((row) => {
      const errors: string[] = [];
      if (!row.name) errors.push('Nom manquant');
      if (!row.email || !emailRegex.test(row.email)) errors.push('Email invalide');
      if (row.phone && !phoneRegex.test(row.phone)) errors.push('Téléphone invalide');

      const key = `${row.name.toLowerCase()}|${row.email.toLowerCase()}`;
      if (seen.has(key)) errors.push('Doublon détecté');
      seen.add(key);

      return { ...row, errors };
    });
  };

  const updateRow = (index: number, updated: Partial<ParsedRow>) => {
    setRows((prev) =>
      prev.map((row) =>
        row.index === index ? validateRows([{ ...row, ...updated }])[0] : row
      )
    );
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      const validRows = rows.filter((r) => r.errors.length === 0);
      const response = await importSuppliers({
        suppliers: validRows.
          map(({ name, email, phone, address }) => ({ name, email, phone, address }))
      }
      );
      if (response.status === 'failure') {
        throw response.data;
      }
      toast({
        title: 'Import terminé',
        description: `${response.data.created + response.data.updated} lignes traitées`,
      });
      setRows([]);
      onResolve?.('success');
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: 'Erreur', description: 'Impossible d’importer les données' });
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = () => {
    const blob = new Blob([
      `"Nom","Numéro","Email","Adresse"`
    ], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'supplier_model.csv';
    link.click();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Importer des fournisseurs</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4 gap-4">
          <div
            {...getRootProps()}
            className={cn(
              'border border-dashed border-gray-300 p-6 rounded-xl w-full text-center cursor-pointer transition-all',
              isDragActive ? 'bg-sky-50 border-sky-500' : 'hover:bg-gray-50'
            )}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="flex flex-col items-center justify-center gap-2">
              <UploadCloud className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-500">
                Glissez un fichier ici ou <span className="text-blue-600 underline" onClick={() => inputRef.current?.click()}>cliquez pour sélectionner</span>
              </p>
              <p className="text-xs text-gray-400">(CSV uniquement)</p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadModel}>Télécharger le modèle</Button>
        </div>

        {rows.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Erreurs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <motion.tr
                    key={row.index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={row.errors.length === 0 ? 'bg-green-50' : 'bg-red-50'}
                  >
                    <TableCell className="text-center">
                      {row.errors.length === 0 ? (
                        <CheckCircle2 className="text-green-600 w-4 h-4" />
                      ) : (
                        <AlertTriangle className="text-red-500 w-4 h-4" />
                      )}
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full text-sm border-none bg-transparent focus:outline-none"
                        value={row.name}
                        onChange={(e) => updateRow(row.index, { name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full text-sm border-none bg-transparent focus:outline-none"
                        value={row.email}
                        onChange={(e) => updateRow(row.index, { email: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full text-sm border-none bg-transparent focus:outline-none"
                        value={row.phone}
                        onChange={(e) => updateRow(row.index, { phone: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full text-sm border-none bg-transparent focus:outline-none"
                        value={row.address}
                        onChange={(e) => updateRow(row.index, { address: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="text-red-600 text-xs">{row.errors.join(', ')}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

          </>
        )}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onReject?.("cancel")}
              >
                Annuler
              </Button>
              <Button
                disabled={rows.filter((r) => r.errors.length === 0).length === 0 || loading}
                onClick={handleImport}
              >
                Importer les lignes valides
              </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
};

export const showImportSupplierModal = create(ImportSupplierModal)
