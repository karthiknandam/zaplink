"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Copy, MousePointerClickIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { linkType } from "@/lib/validation/link.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { timeAgo } from "@/lib/utils/date";
import { compactUrl, MoreButton } from "./UrlCard";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Link from "next/link";

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || "zaaaplink.vercel.app";

/**
 * Pagination required for future improvement on large quantity of data retrewal
 */

export const columns: ColumnDef<linkType>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const isMobile = useIsMobile();
      const code: string = row.getValue("code");
      return (
        <div className="flex gap-2 items-center">
          <Link href={`/code/${code}`}>
            {isMobile ? MAIN_URL.slice(0, 5) + "..." : MAIN_URL}/{code}
          </Link>
          <Copy
            size={13}
            className="cursor-pointer text-primary/50 hover:text-primary"
            onClick={async () => {
              /**
               * Copy to clip board from the url
               */
              await navigator.clipboard.writeText(`${MAIN_URL}/${code}`);
              toast.success("Copied to Clipboard");
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => {
      return <div>Long Url</div>;
    },
    cell: ({ row }) => {
      const isMobile = useIsMobile();
      const url: string = row.getValue("url");
      return <Link href={url}>{compactUrl(url, isMobile)}</Link>;
    },
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clicks
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isMobile = useIsMobile();
      return (
        <div className="bg-background border border-sidebar-border p-1 flex gap-1 rounded-sm w-fit">
          <MousePointerClickIcon
            size={isMobile ? 16 : 18}
            className="text-primary/80"
          />
          <span className="max-sm:text-xs sm:text-sm text-primary/90">
            {row.getValue("count")} clicks
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastClicked",
    header: ({ column }) => <div className="text-right">Last Clicked</div>,
    cell: ({ row }) => {
      const lastClicked: Date | null = row.getValue("lastClicked");
      let value = "";
      if (lastClicked === null) {
        value = "no visits yet";
      } else {
        value = timeAgo(lastClicked);
      }

      return <div className="text-right font-medium">{value}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, column }) => {
      const queryClient = useQueryClient();

      return (
        <MoreButton code={row.getValue("code")} queryClient={queryClient} />
      );
    },
  },
];

export function LinksTable({ data }: { data: linkType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
