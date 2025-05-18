import React from "react";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoonLoader } from "react-spinners";
import styled from "styled-components";
import { cn } from "@/lib/utils";

interface TableProps {
  header: React.ReactElement;
  body: React.ReactElement;
  loading?: boolean;
  maxHeightClassName?: string;
  columnWidths?: number[]; // Prop for column widths, e.g. [100, 200, 150]
  tableWidth?: number; // Prop for column widths, e.g. [100, 200, 150]
  scrollDivRef?: React.Ref<HTMLDivElement> // Peut servir pour connaitre la position du scroll pour l'infinite scrolling
}

const AppTable: React.FC<TableProps> = ({
  header,
  body,
  loading,
  maxHeightClassName,
  columnWidths,
  tableWidth = 1280,
  scrollDivRef,
}) => {
  return (
    <Container className="overflow-x-auto rounded-md border">
      {/* Header Section */}
      <div className={cn(
        "rounded-t-lg overflow-hidden",
        `w-[${tableWidth}px]`
      )}
      >
        <table className="w-full">
          <colgroup>
            {columnWidths?.map((width, index) => (
              <col key={index} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          <TableHeader className="bg-primary-50 text-sm !text-primary-900 font-semibold">
            {header}
          </TableHeader>
        </table>
      </div>

      {/* Body Section */}
      <div
        ref={scrollDivRef}
        className={cn(
          maxHeightClassName ? maxHeightClassName : "max-h-[calc(100vh-255px)]",
          "h-auto overflow-auto",
          `w-[${tableWidth}px]`
        )}
      >
        <table className="w-full border-gray-200 bg-tranparent border-2 border-t-0 rounded-b-lg overflow-hidden">
        <colgroup>
            {columnWidths?.map((width, index) => (
              <col key={index} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          <TableBody>
            {loading ? (
              <TableRow className="w-full !min-h-52 flex items-center justify-center gap-2">
                <TableCell className="text-center">
                  <div className="w-full flex flex-col items-center justify-center gap-2">
                    <MoonLoader className="align-middle" size={30} />
                    <span className="text-sm-medium">
                      Chargement des données en cours...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              body
            )}
          </TableBody>
        </table>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  table {
    table-layout: fixed; /* Keep table layout fixed */
    width: 100%;
  }

  td,
  th {
    padding: 8px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
    > * {
      display: flex;
      justify-content: start;
    }
  }

 

  tbody {
    tr:hover {
      background-color: #f0f4f8; /* Light hover effect for rows */
    }
  }
`;

export default AppTable;
