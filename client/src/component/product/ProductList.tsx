import ProductCart from "./ProductCart";
import type {Product} from '@/types/product'


interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCart
          key={product._id}
          id={product._id}
          name={product.name}
          price={product.price}
          image={product.images?.[0]?.url || ""}
          ratingCount={product.rating_count}
          
        />
      ))}
    </main>
  );
}

export default ProductList;