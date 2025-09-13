import React, { useState, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../auth/AuthProvider";

const UserSavedPosts = () => {
  const queryClient = useQueryClient();
  const [savingPostId, setSavingPostId] = useState(null);
  const { user } = useContext(AuthContext);
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
  return (
    <div className="border flex flex-col flex-1 rounded-xl shadow-md pt-4 p-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        Your Saved Posts
      </h2>

      {isLoading ? (
        <p className="text-gray-500 italic text-center">
          Loading saved posts...
        </p>
      ) : savedPosts?.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          You don’t have any saved posts yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {savedPosts?.map((post) => (
            <div key={post.postId?._id} className="p-2">
              <img
                src={post.book_image}
                alt={post.book_name}
                className="w-32 h-32 object-cover"
              />
              <h3 className="font-medium">{post.book_name}</h3>
              <p className="text-sm text-gray-600">{post.book_category}</p>
              <p className="text-sm font-semibold">{post.book_deal}</p>
              <button
                onClick={() => toggleSavePost(post)}
                disabled={savingPostId === post.id}
                className="mt-2 text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                {savingPostId === post.id
                  ? "Unsaving..."
                  : savedPosts.some((p) => p.id === post.id)
                  ? "Unsave"
                  : "Save"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSavedPosts;
