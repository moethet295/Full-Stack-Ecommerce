import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function SearchBox() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // URL ထဲက keyword ကိုယူမယ်
  // example: ?keyword=jacket
  const initialKeyword =
    searchParams.get("keyword") || "";

  const [keyword, setKeyword] =
    useState<string>(initialKeyword);

  // URL က keyword ပြောင်းသွားရင်
  // input box ကိုပါ update လုပ်မယ်
  useEffect(() => {
    const urlKeyword =
      searchParams.get("keyword") || "";

    setKeyword(urlKeyword);
  }, [searchParams]);

  // Search submit
  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    // ဘာမှမရေးထားရင် search မလုပ်ဘူး
    if (!searchKeyword) {
      return;
    }

    // Product Filter page ကိုသွားမယ်
    navigate(
      `/products/filter?keyword=${encodeURIComponent(
        searchKeyword
      )}`
    );
  };

  return (
    <div className="w-96 relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Find the item you want"
          className="
            bg-gray-200
            focus:outline-0
            py-2
            ps-10
            pe-4
            rounded-full
            text-md
            w-full
            text-black
          "
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
        />

        <button
          type="submit"
          className="
            absolute
            top-1/2
            left-3
            -translate-y-1/2
            flex
            items-center
            justify-center
          "
        >
          <Search
            size={20}
            className="text-black"
          />
        </button>
      </form>
    </div>
  );
}

export default SearchBox;