import React, { useState, useContext } from "react";
import { Menu, Search, BookOpen, User, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { MobileFiltersContext } from "../context/MobileFiltersContext";
const Header = () => {
  const { mobileFiltersOpen, setMobileFiltersOpen } =
    useContext(MobileFiltersContext);
  const [query, setQuery] = useState("");
  // const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const accountNavigation = () => {
    if (user) {
      navigate("/account/posts");
    } else {
      navigate("/login1");
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (location.pathname.startsWith("/")) {
      const params = new URLSearchParams();
      if (value.trim()) params.set("search", value);
      navigate({ pathname: "/books", search: params.toString() });
    }
  };
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60 dark:bg-stone-900/50 border-b border-stone-200/60 dark:border-stone-800">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="rounded-xl border border-stone-300 bg-white/80 p-2 dark:border-stone-700 dark:bg-stone-800"
            aria-label="Open filters"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <a className="flex items-center gap-3" href="/">
          <BookOpen className="h-6 w-6 text-amber-700" />
          <span className="font-serif text-xl tracking-wide text-stone-900 dark:text-stone-100">
            Ktebna
          </span>
        </a>
        <div className="hidden md:flex items-center justify-center">
          <nav className="flex items-center gap-6 text-sm">
            <a className="hover:text-amber-800" href="/">
              Home
            </a>
            <a className="hover:text-amber-800" href="books">
              Books
            </a>
            <a className="hover:text-amber-800" href="/about">
              About
            </a>
            <a className="hover:text-amber-800" href="/contact">
              Contact
            </a>
          </nav>
        </div>
        <div className="hidden md:flex items-center justify-end gap-3">
          <div className="flex items-center rounded-2xl border border-stone-300 bg-white/70 px-3 py-2 dark:border-stone-700 dark:bg-stone-800">
            <Search className="mr-2 h-4 w-4 text-stone-500" />
            <input
              value={query}
              onChange={handleChange}
              placeholder="Search books, authors…"
              className="w-64 bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>
          <button
            className="relative rounded-xl border border-stone-300 bg-white/80 p-2 dark:border-stone-700 dark:bg-stone-800"
            aria-label="Cart"
            onClick={accountNavigation}
          >
            <User className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden">
          <button
            className="relative rounded-xl border border-stone-300 bg-white/80 p-2 dark:border-stone-700 dark:bg-stone-800"
            aria-label="Cart"
            onClick={accountNavigation}
          >
            <User className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="col-span-3 mt-2 flex items-center gap-2 md:hidden">
          <div className="flex w-full items-center rounded-2xl border border-stone-300 bg-white/80 px-3 py-2 dark:border-stone-700 dark:bg-stone-800">
            <Search className="mr-2 h-4 w-4 text-stone-500" />
            <input
              value={query}
              onChange={handleChange}
              placeholder="Search books, authors…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
