import type { Product } from "@/types/product";

import ProductTable from "./ProductTable";

import { PackageOpen } from "lucide-react";

interface ProductTableColumnProps {
  products: Product[];
}

function ProductTableColumn({
  products,
}: ProductTableColumnProps) {
  return (
    <div className="w-full">

      {products.length > 0 ? (

        <ProductTable data={products} />

      ) : (

        <div
          className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            bg-muted/20
            text-center
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
            <PackageOpen className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="text-sm font-semibold">
            No products available
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Create a new product to start building your inventory.
          </p>

        </div>

      )}

    </div>
  );
}

export default ProductTableColumn;