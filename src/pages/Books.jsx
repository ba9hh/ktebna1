import React, { useState } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
export default function BookReaderApp() {
  const [selectedBook, setSelectedBook] = useState(null);

  // Sample books with direct PDF URLs
  const books = [
    {
      id: 1,
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      cover:
        "https://m.media-amazon.com/images/I/81W-pu5en1L._AC_UF1000,1000_QL80_.jpg",
      pdfUrl: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    },
    {
      id: 2,
      title: "Sample Book 2",
      author: "Another Author",
      cover: "https://via.placeholder.com/150x200/7C3AED/ffffff?text=Book+2",
      pdfUrl:
        "https://s1.papyruspub.com/files/demos/products/ebooks/novels/inspiring/Preview-The-Subtle-Art-of-Not-Giving-a-Fck.pdf",
    },
    {
      id: 3,
      title: "Sample Book 3",
      author: "Third Author",
      cover: "https://via.placeholder.com/150x200/EC4899/ffffff?text=Book+3",
      pdfUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 4,
      title: "Sample Book 4",
      author: "Fourth Author",
      cover: "https://via.placeholder.com/150x200/10B981/ffffff?text=Book+4",
      pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
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
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-serif text-2xl text-stone-900">Books</h1>
            </div>

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
