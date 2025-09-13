import React, { useState, useEffect, useContext } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import cities from "../data/cities";
import BottomDrawer from "../components/BottomDrawer";
import BookCard from "../components/BookCard";
import FilterPanel from "../components/FilterPanel";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ChatDrawer from "../chat/ChatDrawer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoginModal from "../auth/LoginModal";
import { useDebounce } from "use-debounce";
import { AuthContext } from "../auth/AuthProvider";
import { MobileFiltersContext } from "../context/MobileFiltersContext";
import { supabase } from "../supabaseClient";

const Books = () => {
  const { mobileFiltersOpen, setMobileFiltersOpen } =
    useContext(MobileFiltersContext);
  const [category, setCategory] = useState("All");
  const [dealType, setDealType] = useState("All");
  const [location, setLocation] = useState("Toute la tunisie");
  const [openLogin, setOpenLogin] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedBookName, setSelectedBookName] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const { user } = useContext(AuthContext);
  console.log(user);
  const fetchShops = async ({ queryKey }) => {
    const [_key, { dealType, location, category, search, userId }] = queryKey;

    let query = supabase.from("posts").select(`
    *,
    users (
      name
    )
  `);
    if (dealType && dealType !== "All") {
      query = query.eq("book_deal_type", dealType);
    }
    if (location && location !== "Toute la tunisie") {
      query = query.eq("book_location", location);
    }
    if (category && category !== "All") {
      query = query.eq("book_category", category);
    }
    if (search) {
      query = query.ilike("book_name", `%${search}%`);
    }
    if (userId) {
      query = query.neq("user_id", userId);
    }
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  };
  useEffect(() => {
    const query = {};
    if (dealType !== "All") query.dealType = dealType;
    if (location !== "Toute la tunisie") query.location = location;
    if (category !== "All") query.category = category;
    const hasFilters = Object.keys(query).length > 0;
    if (hasFilters) {
      setSearchParams(query);
    } else {
      setSearchParams({});
    }
  }, [dealType, location, category]);

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "shops",
      {
        dealType,
        location,
        category,
        search: debouncedSearch,
        userId: user?.id,
      },
    ],
    queryFn: fetchShops,
    keepPreviousData: true,
  });
  const { data: savedPosts } = useQuery({
    queryKey: ["savedPosts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((row) => row.post_id);
    },
    enabled: !!user,
  });

  // Merge posts with saved posts
  const savedSet = new Set(savedPosts || []);
  const annotatedPosts = posts?.map((p) => ({
    ...p,
    isSaved: savedSet.has(p.id),
  }));
  const handleOpenDrawer = (book) => {
    setSelectedBook(book);
    setOpenDrawer(true);
  };
  const handleOpenContactDrawer = (book) => {
    // if (!user) {
    //   setOpenLogin(true);
    //   return;
    // }
    setSelectedSeller(book.user_id);
    setSelectedName(book.users?.name);
    setSelectedBookName(book.book_name);
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedBook(null);
  };
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* Filters sidebar */}
          <aside className="hidden md:block">
            <FilterPanel
              category={category}
              setCategory={setCategory}
              dealType={dealType}
              setDealType={setDealType}
            />
          </aside>

          {/* Catalog */}
          <section id="catalog">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                Recent Books
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-stone-500 md:hidden" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-white/80 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-800"
                >
                  {cities.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center p-8"
                >
                  <CircularProgress />
                </motion.div>
              ) : annotatedPosts?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 dark:border-stone-700"
                >
                  There is no books yet.
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {annotatedPosts?.map((b) => (
                    <BookCard
                      key={b.id}
                      book={b}
                      isSaved={b.isSaved}
                      userId={user?.id}
                      setOpenLogin={setOpenLogin}
                      onClick={() => handleOpenDrawer(b)}
                      handleOpenContactDrawer={() => handleOpenContactDrawer(b)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
        {openDrawer && (
          <BottomDrawer
            open={openDrawer}
            onClose={handleCloseDrawer}
            book={selectedBook}
          />
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
        {/* <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} /> */}
      </main>
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto rounded-r-3xl border-r border-stone-800/20 bg-stone-50 p-4 shadow-xl dark:border-stone-700/50 dark:bg-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <span className="font-semibold">Filters</span>
                </div>
                <button
                  className="rounded-xl border border-stone-300 bg-white/70 p-2 dark:border-stone-700 dark:bg-stone-800"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>
              <FilterPanel
                category={category}
                setCategory={setCategory}
                dealType={dealType}
                setDealType={setDealType}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Books;
