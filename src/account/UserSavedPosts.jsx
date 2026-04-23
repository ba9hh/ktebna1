import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../auth/AuthProvider";
import ChatDrawer from "../chat/ChatDrawer";
import { useTranslation } from "react-i18next";
import BottomDrawer from "../components/BottomDrawer";
import { usePostInteractions } from "../home/usePostInteractions";
const UserSavedPosts = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [savingPostId, setSavingPostId] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedBookName, setSelectedBookName] = useState(null);
  const [open, setOpen] = useState(false);
  const fetchSavedPosts = async () => {
    const { data, error } = await supabase
      .from("saved_posts")
      .select("id, post_id, posts(*)")
      .eq("user_id", user?.id);

    if (error) throw error;
    return data.map((row) => ({
      saved_id: row.id,
      ...row.posts,
    }));
  };

  const {
    data: savedPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["savedPosts", user?.id],
    queryFn: fetchSavedPosts,
    enabled: !!user?.id,
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async (post) => {
      setSavingPostId(post.id);

      const alreadySaved = savedPosts?.some((p) => p.id === post.id);

      if (alreadySaved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id);

        if (error) throw error;

        return savedPosts.filter((p) => p.id !== post.id);
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert([{ user_id: user.id, post_id: post.id }]);

        if (error) throw error;

        const updated = await fetchSavedPosts();
        return updated;
      }
    },
    onSuccess: (newSavedPosts) => {
      queryClient.setQueryData(["savedPosts", user?.id], newSavedPosts);
    },
    onSettled: () => {
      setSavingPostId(null);
    },
  });

  const toggleSavePost = (post) => {
    toggleSaveMutation.mutate(post);
  };
  const handleOpenContactDrawer = (book) => {
    setSelectedSeller(book.user_id);
    setSelectedName(book.users?.name);
    setSelectedBookName(book.book_name);
    setOpen(true);
  };
  const { openDrawer, handleCloseDrawer, handleOpenDrawer, selectedBook } =
    usePostInteractions();
  return (
    <div className="border flex flex-col flex-1 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">{t("savedPosts.title")}</h2>
      <hr />

      {isLoading ? (
        <p className="text-gray-500 italic text-center py-4">
          {t("savedPosts.loading")}
        </p>
      ) : savedPosts?.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">
          {t("savedPosts.noPosts")}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {savedPosts?.map((post) => (
            <div
              key={post.postId?._id}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDrawer(post);
              }}
            >
              <img
                src={post.book_image}
                alt={post.book_name}
                className="w-32 aspect-3/4 object-cover"
              />
              <h3 className="font-medium truncate">{post.book_name}</h3>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => toggleSavePost(post)}
                  disabled={savingPostId === post.id}
                  className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  {savingPostId === post.id
                    ? t("savedPosts.unsaving")
                    : savedPosts.some((p) => p.id === post.id)
                      ? t("savedPosts.unsave")
                      : t("savedPosts.save")}
                </button>
                <button
                  onClick={() => handleOpenContactDrawer(post)}
                  className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 disabled:opacity-50"
                >
                  {t("savedPosts.contact")}
                </button>
              </div>
            </div>
          ))}
          <BottomDrawer
            open={openDrawer}
            onClose={handleCloseDrawer}
            book={selectedBook}
          />
        </div>
      )}
      {open && (
        <ChatDrawer
          open={open}
          onClose={() => {
            setSelectedSeller(null);
            setOpen(false);
          }}
          otherUserId={selectedSeller}
          otherUserName={selectedName}
          bookName={selectedBookName}
        />
      )}
    </div>
  );
};

export default UserSavedPosts;
