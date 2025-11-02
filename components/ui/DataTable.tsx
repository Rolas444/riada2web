'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  loading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  loading = false,
  searchQuery,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 8, // Mismo pageSize que PeopleTable
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Renderizar contenido de loading
  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="overflow-auto max-h-[450px] rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-800">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/80">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span>Cargando datos...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Búsqueda personalizada si se proporciona */}
      {onSearchChange && (
        <div className="flex items-center py-4">
          <Input
            placeholder={filterPlaceholder || "Buscar..."}
            value={searchQuery || ''}
            onChange={(event) => onSearchChange(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      
      {/* Filtro por columna específica si se proporciona */}
      {filterColumn && !onSearchChange && (
        <div className="flex items-center py-4">
          <Input
            placeholder={filterPlaceholder || `Filtrar por ${filterColumn}...`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      
      {/* Tabla con estilos iguales a PeopleTable */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-auto max-h-[450px] rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-800">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Paginación con estilos iguales a PeopleTable */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {data.length > 0 ? (
              (() => {
                const start = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
                const end = Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  data.length
                );
                return `Mostrando ${start}-${end} de ${data.length}`;
              })()
            ) : 'Sin resultados'}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-300 px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
