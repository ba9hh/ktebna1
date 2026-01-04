import React, { useState } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
import BooksHeader from "./BooksHeader";
export default function Books() {
  const [selectedBook, setSelectedBook] = useState(null);

  // Sample books with direct PDF URLs
  const books = [
    {
      id: 1,
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXOhGgB_81F3gu5lNiHFikIZo81OjeqYHdQ&s",
      pdfUrl:
        "https://github.com/rajeevranjancom/Motivational_Books/blob/master/The%20Subtle%20Art%20of%20Not%20Giving%20a%20Fuck%20by%20Mark%20Manson%20(z-lib.org).pdf",
    },
    {
      id: 2,
      title: "The Slight Edge",
      author: "Jeff Olson",
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBuMykPvN8lkeFh48KeTD8siWdstIDiHg3pQ&s",
      pdfUrl:
        "https://travelingdogtor.com/wp-content/uploads/2018/04/The-Slight-Edge.pdf",
    },
    {
      id: 3,
      title: "Deep Work",
      author: "Cal Newport",
      cover:
        "https://edgewaterbookstore.com/cdn/shop/files/Deep_Work_by_Cal_Newport_1500x.jpg?v=1732745604",
      pdfUrl: "https://cpcglobal.org/publications/Deep%20Work.pdf",
    },
    {
      id: 4,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      cover:
        "https://www.eourmart.com/cdn/shop/products/RichDadPoorDad2.png?v=1662552670&width=1445",
      pdfUrl:
        "https://dn721905.ca.archive.org/0/items/rich-dad-poor-dad_bongotweet/rich-dad-poor-dad.pdf",
    },
  ];

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  // Book List View
  if (!selectedBook) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.08),transparent_50%),linear-gradient(to_bottom,#faf7f2,#f7f3ea)] from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-[260px_1fr]">
          <aside className="hidden md:block">
            <FilterPanel />
          </aside>
          <div className="max-w-6xl ">
            <BooksHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 truncate">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-600 font-medium">
                      <BookOpen className="w-4 h-4" />
                      <span>Read Now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PDF Reader View
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.08),transparent_50%),linear-gradient(to_bottom,#faf7f2,#f7f3ea)] mt-2">
      {/* <div className="bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.08),transparent_50%),linear-gradient(to_bottom,#faf7f2,#f7f3ea)] border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-900 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Library</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                {selectedBook.title}
              </h2>
              <p className="text-sm text-gray-400">{selectedBook.author}</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <iframe
            src={selectedBook.pdfUrl}
            className="w-full h-[calc(100vh-120px)]  bg-white"
            title={selectedBook.title}
          />
        </div>
      </div>
    </div>
  );
}
