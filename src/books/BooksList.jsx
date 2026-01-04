import React from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BooksList = ({ books }) => {
  const navigate = useNavigate();

  const handleBookSelect = (book) => {
    navigate(`/books/${book.name}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <p className="text-sm text-gray-600 mb-4 truncate">{book.author}</p>
            <div className="flex items-center justify-center gap-2 text-amber-600 font-medium">
              <BookOpen className="w-4 h-4" />
              <span>Read Now</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksList;
