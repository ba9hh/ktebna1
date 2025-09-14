import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 text-center">
          About <span className="text-amber-600 ">Ktebna</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          <span className="font-semibold">Ktebna</span> is a community-driven
          platform built for book lovers. We believe that books should continue
          their journey, even after you’ve finished reading them. That’s why we
          created a space where you can{" "}
          <span className="font-medium text-blue-600">sell</span>,{" "}
          <span className="font-medium text-green-600">exchange</span>, or{" "}
          <span className="font-medium text-purple-600">donate</span> your
          books.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Instead of leaving books to collect dust on shelves, give them a new
          life and let someone else enjoy the knowledge and stories inside.
          Whether you want to save money, discover new reads, or simply share
          knowledge with others —<span className="font-semibold">Ktebna</span>{" "}
          makes it easy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-8">
          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Sell</h3>
            <p className="text-gray-600 text-sm">
              Turn your unused books into value by selling them to readers who
              need them.
            </p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Exchange
            </h3>
            <p className="text-gray-600 text-sm">
              Swap your books with others and discover new reads without
              spending money.
            </p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Donate
            </h3>
            <p className="text-gray-600 text-sm">
              Share knowledge and stories by donating books to those who need
              them most.
            </p>
          </div>
        </div>

        <p className="text-gray-700 text-lg mt-10 text-center italic">
          📚 Together, let’s build a culture of sharing and make books more
          accessible.
        </p>
      </div>
    </div>
  );
};

export default About;
