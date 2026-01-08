import React from "react";
import BooksFilterPanel from "../components/BooksFilterPanel";
import BooksHeader from "./BooksHeader";
import BooksList from "./BooksList";
import { booksData } from "../data/booksData";

export default function Books() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 mt-6">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <BooksFilterPanel />
        </aside>
        <section id="catalog">
          <BooksHeader />
          <BooksList books={booksData} />
        </section>
      </div>
    </div>
  );
}
