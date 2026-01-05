import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddPostModal from "./modal/AddPostModal";
import UpdatePostModal from "./modal/UpdatePostModal";
import DeletePostModal from "./modal/DeletePostModal";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
const UserPosts = () => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  };
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userPosts"], // cache key
    queryFn: fetchPosts,
  });
  const handleOpenUpdate = (post) => {
    setSelectedPost(post);
    setShowUpdateModal(true);
  };
  const handleOpenDelete = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };
  return (
    <div className="relative bg-white border border-gray-200 flex flex-col flex-1 rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {t("userPosts.yourPosts")}
        </h2>
        <button
          className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 active:scale-95 transition-all duration-200 whitespace-nowrap"
          onClick={() => setShowAddModal(true)}
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("userPosts.addPost")}
          </span>
        </button>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
          <p className="text-gray-500 text-lg">{t("userPosts.loading")}</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            className="w-16 h-16 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 text-lg font-medium">
            Error loading posts
          </p>
        </div>
      ) : posts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">{t("userPosts.noPosts")}</p>
          <p className="text-gray-400 text-sm">
            Get started by adding your first book post
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={post.book_image}
                  alt={post.book_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Container */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">
                  {post.book_name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">
                  {post.book_category}
                </p>
                <p className="text-amber-700 font-bold text-lg mb-4">
                  {post.book_deal}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenUpdate(post)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {t("userPosts.edit")}
                  </button>
                  <button
                    onClick={() => handleOpenDelete(post)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-200 font-medium shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {t("userPosts.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddPostModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        userId={user?.id}
      />
      {selectedPost && (
        <UpdatePostModal
          open={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPost(null);
            fetchPosts();
          }}
          post={selectedPost}
        />
      )}
      {selectedPost && (
        <DeletePostModal
          open={showDeleteModal}
          onClose={(deleted) => {
            setShowDeleteModal(false);
            setSelectedPost(null);
            if (deleted) fetchPosts();
          }}
          postId={selectedPost.id}
        />
      )}
    </div>
  );
};

export default UserPosts;
