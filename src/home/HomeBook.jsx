import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useTranslation } from "react-i18next";
const HomeBook = ({
  book,
  userId,
  isSaved: isSavedProp = false,
  setOpenLogin,
  onClick,
  handleOpenContactDrawer,
}) => {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setIsSaved(isSavedProp);
  }, [isSavedProp]);
  const toggleSavePost = async (postId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("saved_posts")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (data) {
        const { error: deleteError } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", userId)
          .eq("post_id", postId);

        if (deleteError) throw deleteError;
        return { status: "unsaved" };
      } else {
        const { error: insertError } = await supabase
          .from("saved_posts")
          .insert([{ user_id: userId, post_id: postId }]);

        if (insertError) throw insertError;
        return { status: "saved" };
      }
    } catch (err) {
      console.error("Error toggling save:", err.message);
      throw err;
    }
  };
  const handleToggleSave = async (postId) => {
    if (!userId) {
      setOpenLogin(true);
      return;
    }
    setSaving(true);
    try {
      const result = await toggleSavePost(postId);
      setIsSaved(result.status === "saved");
    } catch (err) {
      console.error("Save toggle failed:", err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onClick}
      className="group relative rounded-2xl border border-stone-200/60 bg-stone-50 shadow-sm transition hover:shadow-lg dark:border-stone-800/60 dark:bg-stone-900 cursor-pointer"
    >
      {book.book_deal_type && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-amber-600/95 px-2.5 py-1 text-xs font-medium text-amber-50 shadow">
          {t(`filterPanel.${book.book_deal_type.toLowerCase()}`)}
        </div>
      )}

      <div className="relative w-full rounded-xl p-4 shadow-inner">
        <img src={book.book_image} className="w-full aspect-3/4 object-cover" />
        {book.book_category && (
          <div className="absolute right-3 bottom-3 z-10 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-medium text-amber-50 shadow truncate max-w-[60%]">
            {t(`categories.${book.book_category}`)}
          </div>
        )}
      </div>

      <div className="space-y-1 px-5 pb-5">
        <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 line-clamp-2 truncate">
          {book.book_name}
        </h3>
        <div>
          <p className="text-sm text-black dark:text-stone-400">
            {book.users?.name}
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {book.book_location}
          </p>
        </div>

        <div className="mt-3 space-y-3">
          {/* Book price or offer */}
          <p className="text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 truncate">
            {book.book_deal}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSave(book.id);
              }}
              disabled={saving}
              className="flex items-center gap-1 rounded-xl border border-stone-300 bg-white/70 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 max-w-[50%]"
              aria-label="Add to wishlist"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span className="hidden sm:inline truncate">
                {isSaved ? t("bookCard.saved") : t("bookCard.save")}
              </span>
            </button>

            <button
              className="flex items-center gap-1 rounded-xl bg-amber-700 px-3 py-2 text-sm font-medium text-amber-50 shadow hover:bg-amber-800 active:scale-[0.98]"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenContactDrawer();
              }}
            >
              <span>{t("bookCard.contact")}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeBook;
