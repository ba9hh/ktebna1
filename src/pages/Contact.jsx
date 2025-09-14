import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 text-center">
          Contact <span className="text-amber-600">Ktebna</span>
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Have questions, feedback, or just want to reach out? Fill out the form
          below and we’ll get back to you as soon as possible.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center text-gray-600 text-sm">
          Or reach us at:{" "}
          <span className="font-medium text-amber-600">ktebna@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
