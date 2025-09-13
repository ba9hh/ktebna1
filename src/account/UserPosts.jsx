import React, { useState, useContext } from "react";
import AddPostModal from "./AddPostModal";
import UpdatePostModal from "./UpdatePostModal";
import DeletePostModal from "./DeletePostModal";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
const UserPosts = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user?.id) // fetch only this user's posts
      .order("created_at", { ascending: false }); // optional

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
  console.log(posts);
  return (
    <div className="relative border flex flex-col flex-1 rounded-xl shadow-md pt-4 p-6">
      <button
        className="absolute right-3 rounded-xl bg-amber-700 px-3 py-2 text-sm font-medium text-amber-50 shadow hover:bg-amber-800 active:scale-[0.98] h-fit w-fit"
        onClick={() => setShowAddModal(true)}
      >
        Add Post
      </button>
      <h2 className="text-xl font-semibold text-center mb-4">Your Posts</h2>

      {isLoading ? (
        <p className="text-gray-500 italic text-center">Loading posts...</p>
      ) : posts?.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          You don’t have any posts yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts?.map((post) => (
            <div key={post.id} className="p-2">
              <img
                src={post.book_image}
                alt={post.book_name}
                className="w-32 h-32 object-cover "
              />
              <h3 className="font-medium">{post.book_name}</h3>
              <p className="text-sm text-gray-600">{post.book_category}</p>
              <p className="text-sm font-semibold">{post.book_deal}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleOpenUpdate(post)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenDelete(post)}
                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
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
