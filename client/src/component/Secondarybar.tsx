import { Menu } from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const categories = [
  "T-shirts",
  "Hoodies",
  "Shirt",
  "Gym",
  "Shorts",
  "Jeans",
];

function Secondarybar() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // =========================================
  // CURRENT CATEGORY FROM URL
  // =========================================
  const currentCategory =
    searchParams.get("category") || "";

  // =========================================
  // CATEGORY CLICK
  // =========================================
  const categoryHandler = (category: string) => {
    const newParams =
      new URLSearchParams(searchParams);

    // category ကို URL ထဲထည့်
    newParams.set(
      "category",
      category.toLowerCase()
    );

    // Product Filter page ကိုသွား
    navigate(
      `/products/filter?${newParams.toString()}`
    );
  };

  return (
    <main className="bg-gray-300 text-black py-3">

      <div
        className="
          max-w-6xl
          mx-auto
          flex
          items-center
          justify-between
        "
      >

        {/* =========================
            CATEGORY TITLE
        ========================== */}
        <div className="flex gap-2 items-center">

          <Menu className="mr-2" />

          <h2 className="text-md font-semibold">
            Categories
          </h2>

        </div>

        {/* =========================
            CATEGORY ITEMS
        ========================== */}
        <div
          className="
            flex
            items-center
            gap-4
            font-medium
            text-base
          "
        >

          {categories.map((category) => {

            const isActive =
              currentCategory.toLowerCase() ===
              category.toLowerCase();

            return (
              <p
                key={category}
                onClick={() =>
                  categoryHandler(category)
                }
                className={`
                  cursor-pointer
                  transition-colors
                  duration-200
                  ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-black hover:text-blue-600"
                  }
                `}
              >
                {category}
              </p>
            );
          })}

        </div>

      </div>

    </main>
  );
}

export default Secondarybar;