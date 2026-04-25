import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import AddPostModal from "./modal/AddPostModal";
import UpdatePostModal from "./modal/UpdatePostModal";
import DeletePostModal from "./modal/DeletePostModal";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Plus, Globe, Lock } from "lucide-react";
import { usePostInteractions } from "../home/usePostInteractions";
import BookDrawer from "../components/BookDrawer";
import HomePagination from "../home/HomePagination";
const UserPosts = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const fetchPosts = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data,
      count,
    };
  };
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userPosts", page], // cache key
    queryFn: fetchPosts,
    keepPreviousData: true,
  });
  const totalPages = posts?.count ? Math.ceil(posts.count / pageSize) : 0;
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_public }) => {
      const { error } = await supabase
        .from("posts")
        .update({ is_public })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, is_public }) => {
      await queryClient.cancelQueries({ queryKey: ["userPosts", page] });
      const previous = queryClient.getQueryData(["userPosts", page]);

      queryClient.setQueryData(["userPosts", page], (old) => ({
        ...old,
        data: old.data.map((post) =>
          post.id === id ? { ...post, is_public } : post,
        ),
      }));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["userPosts", page], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
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
        old ? old.filter((post) => post.id !== deletedPost.id) : [],
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

  const addMutation = useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from("posts")
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["userPosts"] });
      const previousPosts = queryClient.getQueryData(["userPosts"]);

      const optimisticPost = {
        ...newPost,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(["userPosts"], (old) =>
        old ? [optimisticPost, ...old] : [optimisticPost],
      );

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
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
  const { openDrawer, handleCloseDrawer, handleOpenDrawer, selectedBook } =
    usePostInteractions();
  return (
    <div className="relative border flex flex-col flex-1 rounded-xl shadow-md p-4">
      <button
        className="absolute right-3 rounded-xl bg-amber-700 px-3 py-1 text-sm font-medium text-amber-50 shadow hover:bg-amber-800 active:scale-[0.98] h-fit w-fit"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-5 h-5 sm:hidden" />
        <span className="hidden sm:inline">{t("userPosts.addPost")}</span>
      </button>
      <h2 className="text-lg font-semibold mb-4">{t("userPosts.yourPosts")}</h2>
      <hr />

      {isLoading ? (
        <p className="text-gray-500 italic text-center py-4">
          {t("userPosts.loading")}
        </p>
      ) : posts?.data?.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">
          {t("userPosts.noPosts")}
        </p>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            {posts?.data?.map((post) => (
              <div
                key={post.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(post);
                }}
              >
                <div className="relative w-32">
                  <img
                    src={post.book_image}
                    alt={post.book_name}
                    className="w-32 aspect-3/4 object-cover"
                  />
                  {/* ── Visibility badge ── */}
                  <span
                    className={`absolute top-1 right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5
                      ${
                        post.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {post.is_public ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {post.is_public
                      ? t("userPosts.public", "Public")
                      : t("userPosts.private", "Private")}
                  </span>
                </div>
                <h3 className="font-medium truncate">{post.book_name}</h3>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibilityMutation.mutate({
                        id: post.id,
                        is_public: !post.is_public,
                      });
                    }}
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1
                      ${
                        post.is_public
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                  >
                    {post.is_public ? (
                      <>
                        {/* <Lock className="w-3 h-3" />{" "} */}
                        {t("userPosts.makePrivate", "Make Private")}
                      </>
                    ) : (
                      <>
                        {/* <Globe className="w-3 h-3" />{" "} */}
                        {t("userPosts.makePublic", "Make Public")}
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenUpdate(post);
                    }}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    {t("userPosts.edit")}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDelete(post);
                    }}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    {t("userPosts.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <HomePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <BookDrawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        book={selectedBook}
      />
      <AddPostModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        userId={user?.id}
        onAdd={addMutation.mutate}
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
