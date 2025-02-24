"use client";

import { useTheme } from "next-themes";


export default function ThemeSwitcher() {
  const { theme,setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full transition"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
}
