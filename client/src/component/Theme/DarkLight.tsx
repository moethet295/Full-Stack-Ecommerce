import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

function DarkLight() {

  const [isDark, setIsDark] =
    useState<boolean>(() => {

      const savedTheme =
        localStorage.getItem("theme");

      return savedTheme === "dark";

    });

  // =====================================
  // APPLY THEME
  // =====================================

  useEffect(() => {

    const root =
      document.documentElement;

    if (isDark) {

      root.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      root.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }, [isDark]);

  return (
    <div
      className="
        flex
        items-center
        gap-3
        text-white
      "
    >

      {/* LIGHT MODE */}

      <button
        type="button"
        onClick={() =>
          setIsDark(false)
        }
        title="Light Mode"
        className={`
          cursor-pointer
          rounded-full
          p-1
          transition-all
          duration-200

          ${
            !isDark
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }
        `}
      >
        <Sun
          className="
            h-5
            w-5
          "
        />
      </button>

      {/* DARK MODE */}

      <button
        type="button"
        onClick={() =>
          setIsDark(true)
        }
        title="Dark Mode"
        className={`
          cursor-pointer
          rounded-full
          p-1
          transition-all
          duration-200

          ${
            isDark
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }
        `}
      >
        <Moon
          className="
            h-5
            w-5
          "
        />
      </button>

    </div>
  );
}

export default DarkLight;