import { Link } from "react-router-dom";
import RatingCoverter from "../../common/RatingCoverter";

interface ProductCartProps {
  name: string;
  price: number;
  image: string;
  ratingCount: number;
  id: string;
}

function ProductCart({
  name,
  price,
  image,
  ratingCount,
  id,
}: ProductCartProps) {
  return (
    <Link to={`/products/${id}`}>
      <div className="my-4 cursor-pointer">
        <img
          src={image}
          alt={name}
          className="w-35 h-35 object-cover gap-3 rounded-xl shadow-2xl"
        />

        <h2>
          {name.length > 15
            ? name.slice(0, 15) + "....."
            : name}
        </h2>

        <RatingCoverter count={ratingCount} />

        <p>${price}</p>
      </div>
    </Link>
  );
}

export default ProductCart;
