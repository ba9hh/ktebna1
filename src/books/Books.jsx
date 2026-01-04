import React from "react";
import FilterPanel from "../components/FilterPanel";
import BooksHeader from "./BooksHeader";
import BooksList from "./BooksList";
import { booksData } from "../data/booksData";

export default function Books() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.08),transparent_50%),linear-gradient(to_bottom,#faf7f2,#f7f3ea)] from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <FilterPanel />
        </aside>
        <div className="max-w-6xl">
          <BooksHeader />
          <BooksList books={booksData} />
        </div>
      </div>
    </div>
  );
}
