import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddPostModal from "./modal/AddPostModal";
import UpdatePostModal from "./modal/UpdatePostModal";
import DeletePostModal from "./modal/DeletePostModal";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Plus } from "lucide-react";

const UserPosts = () => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

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
  const deleteMutation = useMutation({
    mutationFn: async (post) => {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (deleteError) throw deleteError;

      if (post.book_image) {
        const fileName = post.book_image.split("/").pop();
        await supabase.storage.from("images").remove([fileName]);
      }

      return post.id;
    },
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({ queryKey: ["userPosts"] });
      const previousPosts = queryClient.getQueryData(["userPosts"]);

      queryClient.setQueryData(["userPosts"], (old) =>
        old ? old.filter((post) => post.id !== deletedPost.id) : []
      );

      return { previousPosts };
    },
    onError: (err, deletedPost, context) => {
      queryClient.setQueryData(["userPosts"], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
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
    <div className="relative border flex flex-col flex-1 rounded-xl shadow-md pt-4 p-6">
      <button
        className="absolute right-3 rounded-xl bg-amber-700 px-3 py-2 text-sm font-medium text-amber-50 shadow hover:bg-amber-800 active:scale-[0.98] h-fit w-fit"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-5 h-5 sm:hidden" />
        <span className="hidden sm:inline">{t("userPosts.addPost")}</span>
      </button>
      <h2 className="text-xl font-semibold text-center mb-4">
        {t("userPosts.yourPosts")}
      </h2>

      {isLoading ? (
        <p className="text-gray-500 italic text-center">
          {t("userPosts.loading")}
        </p>
      ) : posts?.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          {t("userPosts.noPosts")}
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
              <h3 className="font-medium truncate">{post.book_name}</h3>
              <p className="text-sm text-gray-600 truncate">
                {t(post.book_category)}
              </p>
              <p className="text-sm font-semibold truncate">{post.book_deal}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleOpenUpdate(post)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  {t("userPosts.edit")}
                </button>
                <button
                  onClick={() => handleOpenDelete(post)}
                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  {t("userPosts.delete")}
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
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
          onDelete={deleteMutation.mutate}
        />
      )}
    </div>
  );
};

export default UserPosts;
