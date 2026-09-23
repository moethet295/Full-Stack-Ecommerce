import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Product } from "@/types/product";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  useTable,
} from "@tanstack/react-table";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Search,
  X,
} from "lucide-react";

import useProductColumns, {
  productTableFeatures,
} from "./ProductColumn";

// =========================================
// PROPS
// =========================================

interface ProductTableProps {
  data: Product[];
}

// =========================================
// SORT TYPES
// =========================================

type SortField =
  | "name"
  | "price"
  | "instock_count"
  | "createdAt";

type SortDirection =
  | "asc"
  | "desc";

// =========================================
// COMPONENT
// =========================================

function ProductTable({
  data,
}: ProductTableProps) {

  // =========================================
  // COLUMNS
  // =========================================

  const columns =
    useProductColumns();

  // =========================================
  // FILTER INPUT
  // =========================================

  // User ရိုက်နေတဲ့ value
  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  // Enter နှိပ်ပြီးမှ filter လုပ်မယ့် value
  const [
    search,
    setSearch,
  ] = useState("");

  // =========================================
  // SORTING
  // =========================================

  const [
    sortField,
    setSortField,
  ] = useState<SortField | null>(
    null
  );

  const [
    sortDirection,
    setSortDirection,
  ] = useState<SortDirection>(
    "asc"
  );

  // =========================================
  // PAGINATION
  // =========================================

  const ITEMS_PER_PAGE = 5;

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // =========================================
  // FILTER + SORT DATA
  // =========================================

  const processedData =
    useMemo(() => {

      let result = [...data];

      // =====================================
      // FILTER
      // =====================================

      const keyword =
        search
          .trim()
          .toLowerCase();

      if (keyword) {

        result =
          result.filter(
            (product) => {

              const name =
                product.name
                  ?.toLowerCase() ||
                "";

              const category =
                product.category
                  ?.toLowerCase() ||
                "";

              return (
                name.includes(keyword) ||
                category.includes(keyword)
              );
            }
          );
      }

      // =====================================
      // SORT
      // =====================================

      if (sortField) {

        result.sort(
          (a, b) => {

            let comparison = 0;

            // ===============================
            // NAME
            // ===============================

            if (
              sortField === "name"
            ) {

              comparison =
                a.name.localeCompare(
                  b.name
                );
            }

            // ===============================
            // PRICE
            // ===============================

            if (
              sortField === "price"
            ) {

              comparison =
                a.price -
                b.price;
            }

            // ===============================
            // STOCK
            // ===============================

            if (
              sortField ===
              "instock_count"
            ) {

              comparison =
                a.instock_count -
                b.instock_count;
            }

            // ===============================
            // CREATED DATE
            // ===============================

            if (
              sortField ===
              "createdAt"
            ) {

              const aTime =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    ).getTime()
                  : 0;

              const bTime =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    ).getTime()
                  : 0;

              comparison =
                aTime - bTime;
            }

            // ===============================
            // ASC / DESC
            // ===============================

            return (
              sortDirection ===
              "asc"
                ? comparison
                : -comparison
            );
          }
        );
      }

      return result;

    }, [
      data,
      search,
      sortField,
      sortDirection,
    ]);

  // =========================================
  // TOTAL PAGES
  // =========================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        processedData.length /
          ITEMS_PER_PAGE
      )
    );

  // =========================================
  // RESET PAGE WHEN FILTER / SORT CHANGES
  // =========================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    sortField,
    sortDirection,
  ]);

  // =========================================
  // PAGE SAFETY
  // =========================================

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );
    }

  }, [
    currentPage,
    totalPages,
  ]);

  // =========================================
  // PAGE DATA
  // =========================================

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex +
    ITEMS_PER_PAGE;

  const paginatedData =
    processedData.slice(
      startIndex,
      endIndex
    );

  // =========================================
  // TABLE
  // =========================================

  const table = useTable({
    features:
      productTableFeatures,

    data:
      paginatedData,

    columns,
  });

  // =========================================
  // SEARCH HANDLER
  // =========================================

  const handleSearch = () => {

    setSearch(
      searchInput.trim()
    );

    setCurrentPage(1);
  };

  // =========================================
  // CLEAR SEARCH
  // =========================================

  const handleClearSearch = () => {

    setSearchInput("");

    setSearch("");

    setCurrentPage(1);
  };

  // =========================================
  // SORT HANDLER
  // =========================================

  const handleSort = (
    field: SortField
  ) => {

    // Same column နှိပ်ရင်
    // ASC / DESC ပြောင်းမယ်

    if (
      sortField === field
    ) {

      setSortDirection(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );

      return;
    }

    // Column အသစ်နှိပ်ရင်
    // ASC ကစမယ်

    setSortField(field);

    setSortDirection("asc");
  };

  // =========================================
  // SORT ICON
  // =========================================

  const renderSortIcon = (
    field: SortField
  ) => {

    // Not selected

    if (
      sortField !== field
    ) {

      return (
        <ArrowUpDown
          className="
            h-3.5
            w-3.5
            opacity-50
          "
        />
      );
    }

    // ASC

    if (
      sortDirection === "asc"
    ) {

      return (
        <ArrowUp
          className="
            h-3.5
            w-3.5
          "
        />
      );
    }

    // DESC

    return (
      <ArrowDown
        className="
          h-3.5
          w-3.5
        "
      />
    );
  };

  // =========================================
  // PREVIOUS PAGE
  // =========================================

  const previousPage = () => {

    setCurrentPage(
      (page) =>
        Math.max(
          page - 1,
          1
        )
    );
  };

  // =========================================
  // NEXT PAGE
  // =========================================

  const nextPage = () => {

    setCurrentPage(
      (page) =>
        Math.min(
          page + 1,
          totalPages
        )
    );
  };

  // =========================================
  // SHOWING PRODUCTS
  // =========================================

  const showingFrom =
    processedData.length === 0
      ? 0
      : startIndex + 1;

  const showingTo =
    Math.min(
      endIndex,
      processedData.length
    );

  // =========================================
  // PAGE NUMBERS
  // =========================================

  const pageNumbers =
    Array.from(
      {
        length:
          totalPages,
      },

      (_, index) =>
        index + 1
    );

  // =========================================
  // SORTABLE COLUMNS
  // =========================================

  const sortableColumns:
    SortField[] = [
      "name",
      "price",
      "instock_count",
      "createdAt",
    ];

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="w-full">

      {/* ================================= */}
      {/* FILTER BAR */}
      {/* ================================= */}

      <div
        className="
          mb-4
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* ================================= */}
        {/* SEARCH FORM */}
        {/* ================================= */}

        <form
          onSubmit={(event) => {

            event.preventDefault();

            handleSearch();
          }}
          className="
            flex
            w-full
            max-w-md
            items-center
            gap-2
          "
        >

          {/* =============================== */}
          {/* SEARCH INPUT */}
          {/* =============================== */}

          <div
            className="
              relative
              flex-1
            "
          >

            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <input
              type="text"
              value={
                searchInput
              }
              onChange={(
                event
              ) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="Filter products..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-input
                bg-background
                pl-9
                pr-9
                text-sm
                outline-none
                transition-all
                placeholder:text-muted-foreground
                focus:border-foreground/30
                focus:ring-2
                focus:ring-foreground/10
              "
            />

            {/* ============================= */}
            {/* CLEAR X BUTTON */}
            {/* ============================= */}

            {searchInput && (

              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                aria-label="Clear filter"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >

                <X
                  className="
                    h-4
                    w-4
                  "
                />

              </button>

            )}

          </div>

          {/* =============================== */}
          {/* ENTER BUTTON */}
          {/* =============================== */}

          <button
            type="submit"
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-foreground
              px-5
              text-sm
              font-medium
              text-background
              transition-colors
              hover:bg-foreground/90
            "
          >
            Enter
          </button>

        </form>

        {/* ================================= */}
        {/* SEARCH RESULT COUNT */}
        {/* ================================= */}

        {search && (

          <p
            className="
              whitespace-nowrap
              text-xs
              text-muted-foreground
            "
          >

            <span
              className="
                font-semibold
                text-foreground
              "
            >
              {processedData.length}
            </span>

            {" "}

            result

            {processedData.length !== 1
              ? "s"
              : ""}

          </p>

        )}

      </div>

      {/* ================================= */}
      {/* TABLE CONTAINER */}
      {/* ================================= */}

      <div
        className="
          w-full
          overflow-hidden
          rounded-xl
          border
          border-border/70
          bg-background
          shadow-sm
        "
      >

        <div className="overflow-x-auto">

          <Table>

            {/* ============================= */}
            {/* TABLE HEADER */}
            {/* ============================= */}

            <TableHeader
              className="
                bg-muted/40
              "
            >

              {table
                .getHeaderGroups()
                .map(
                  (
                    headerGroup
                  ) => (

                    <TableRow
                      key={
                        headerGroup.id
                      }
                      className="
                        border-b
                        border-border/70
                        hover:bg-transparent
                      "
                    >

                      {headerGroup
                        .headers
                        .map(
                          (
                            header
                          ) => {

                            const columnId =
                              header
                                .column
                                .id;

                            const isSortable =
                              sortableColumns.includes(
                                columnId as SortField
                              );

                            return (

                              <TableHead
                                key={
                                  header.id
                                }
                                className="
                                  h-12
                                  whitespace-nowrap
                                  px-5
                                  text-[11px]
                                  font-semibold
                                  uppercase
                                  tracking-wider
                                  text-muted-foreground
                                "
                              >

                                {header.isPlaceholder
                                  ? null
                                  : isSortable
                                    ? (

                                      // =====================
                                      // SORTABLE HEADER
                                      // =====================

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSort(
                                            columnId as SortField
                                          )
                                        }
                                        className="
                                          inline-flex
                                          items-center
                                          gap-1.5
                                          transition-colors
                                          hover:text-foreground
                                        "
                                      >

                                        {flexRender(
                                          header
                                            .column
                                            .columnDef
                                            .header,

                                          header.getContext()
                                        )}

                                        {renderSortIcon(
                                          columnId as SortField
                                        )}

                                      </button>

                                    )
                                    : (

                                      // =====================
                                      // NORMAL HEADER
                                      // =====================

                                      flexRender(
                                        header
                                          .column
                                          .columnDef
                                          .header,

                                        header.getContext()
                                      )

                                    )}

                              </TableHead>

                            );
                          }
                        )}

                    </TableRow>

                  )
                )}

            </TableHeader>

            {/* ============================= */}
            {/* TABLE BODY */}
            {/* ============================= */}

            <TableBody>

              {table
                .getRowModel()
                .rows.length >
              0 ? (

                table
                  .getRowModel()
                  .rows
                  .map(
                    (
                      row
                    ) => (

                      <TableRow
                        key={
                          row.id
                        }
                        className="
                          group
                          border-b
                          border-border/50
                          transition-colors
                          last:border-b-0
                          hover:bg-muted/30
                        "
                      >

                        {row
                          .getAllCells()
                          .map(
                            (
                              cell
                            ) => (

                              <TableCell
                                key={
                                  cell.id
                                }
                                className="
                                  px-5
                                  py-3.5
                                  align-middle
                                  text-sm
                                "
                              >

                                {flexRender(
                                  cell
                                    .column
                                    .columnDef
                                    .cell,

                                  cell.getContext()
                                )}

                              </TableCell>

                            )
                          )}

                      </TableRow>

                    )
                  )

              ) : (

                // ===========================
                // EMPTY STATE
                // ===========================

                <TableRow>

                  <TableCell
                    colSpan={
                      columns.length
                    }
                    className="
                      h-56
                      text-center
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >

                      <div
                        className="
                          mb-3
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-muted
                        "
                      >

                        <PackageOpen
                          className="
                            h-5
                            w-5
                            text-muted-foreground
                          "
                        />

                      </div>

                      <p
                        className="
                          text-sm
                          font-semibold
                        "
                      >

                        {search
                          ? "No matching products"
                          : "No products found"}

                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-muted-foreground
                        "
                      >

                        {search
                          ? `No products match "${search}".`
                          : "Create a new product to get started."}

                      </p>

                      {/* ===================== */}
                      {/* CLEAR FILTER */}
                      {/* ===================== */}

                      {search && (

                        <button
                          type="button"
                          onClick={
                            handleClearSearch
                          }
                          className="
                            mt-3
                            text-xs
                            font-medium
                            underline
                            underline-offset-4
                          "
                        >
                          Clear filter
                        </button>

                      )}

                    </div>

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </div>

      </div>

      {/* ================================= */}
      {/* PAGINATION */}
      {/* ================================= */}

      {processedData.length >
        0 && (

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* ============================= */}
          {/* PRODUCT COUNT */}
          {/* ============================= */}

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >

            Showing{" "}

            <span
              className="
                font-semibold
                text-foreground
              "
            >
              {showingFrom}
            </span>

            {" – "}

            <span
              className="
                font-semibold
                text-foreground
              "
            >
              {showingTo}
            </span>

            {" of "}

            <span
              className="
                font-semibold
                text-foreground
              "
            >
              {processedData.length}
            </span>

            {" products"}

          </p>

          {/* ============================= */}
          {/* PAGINATION BUTTONS */}
          {/* ============================= */}

          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={
                previousPage
              }
              disabled={
                currentPage === 1
              }
              aria-label="Previous page"
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-md
                border
                border-border
                bg-background
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                disabled:pointer-events-none
                disabled:opacity-40
              "
            >

              <ChevronLeft
                className="
                  h-4
                  w-4
                "
              />

            </button>

            {/* ============================= */}
            {/* PAGE NUMBERS */}
            {/* ============================= */}

            {pageNumbers.map(
              (
                page
              ) => (

                <button
                  key={
                    page
                  }
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`
                    inline-flex
                    h-9
                    min-w-9
                    items-center
                    justify-center
                    rounded-md
                    px-2
                    text-sm
                    font-medium
                    transition-colors

                    ${
                      currentPage ===
                      page

                        ? `
                          bg-foreground
                          text-background
                        `

                        : `
                          border
                          border-border
                          bg-background
                          text-muted-foreground
                          hover:bg-muted
                          hover:text-foreground
                        `
                    }
                  `}
                >

                  {page}

                </button>

              )
            )}

            {/* NEXT */}

            <button
              type="button"
              onClick={
                nextPage
              }
              disabled={
                currentPage ===
                totalPages
              }
              aria-label="Next page"
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-md
                border
                border-border
                bg-background
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                disabled:pointer-events-none
                disabled:opacity-40
              "
            >

              <ChevronRight
                className="
                  h-4
                  w-4
                "
              />

            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ProductTable;