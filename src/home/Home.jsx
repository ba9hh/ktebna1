import React, { useState, useContext } from "react";
import BottomDrawer from "../components/BottomDrawer";
import FilterPanel from "../components/FilterPanel";
import { useSearchParams } from "react-router-dom";
import ChatDrawer from "../chat/ChatDrawer";
import LoginModal from "../auth/LoginModal";
import { useDebounce } from "use-debounce";
import { AuthContext } from "../auth/AuthProvider";
import { MobileFiltersContext } from "../context/MobileFiltersContext";
import { usePosts } from "./usePosts";
import { useSavedPosts } from "./useSavedPosts";
import { useHomeFilters } from "./useHomeFilters";
import { usePostInteractions } from "./usePostInteractions";
import HomeBooks from "./HomeBooks";
import HomeHeader from "./HomeHeader";
import MobileFiltersDrawer from "./MobileFiltersDrawer";
import HomePagination from "./HomePagination";

const Home = () => {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const { mobileFiltersOpen, setMobileFiltersOpen } =
    useContext(MobileFiltersContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const { user } = useContext(AuthContext);
  const {
    category,
    setCategory,
    dealType,
    setDealType,
    location,
    setLocation,
  } = useHomeFilters();

  const { data, isLoading, isError } = usePosts({
    dealType,
    location,
    category,
    search: debouncedSearch,
    userId: user?.id,
    page,
    pageSize,
  });
  const posts = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  const { data: savedPosts } = useSavedPosts(user);

  // Merge posts with saved posts
  const savedSet = new Set(savedPosts || []);
  const annotatedPosts = posts?.map((p) => ({
    ...p,
    isSaved: savedSet.has(p.id),
  }));
  const {
    openLogin,
    setOpenLogin,
    selectedBook,
    openDrawer,
    openChatDrawer,
    chatDetails,
    handleOpenDrawer,
    handleCloseDrawer,
    handleOpenChatDrawer,
    handleCloseChatDrawer,
  } = usePostInteractions(user);

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
            <HomeHeader location={location} setLocation={setLocation} />

            <HomeBooks
              posts={annotatedPosts}
              isLoading={isLoading}
              user={user}
              setOpenLogin={setOpenLogin}
              onBookClick={handleOpenDrawer}
              onContactClick={handleOpenChatDrawer}
            />
            <HomePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </div>

        <BottomDrawer
          open={openDrawer}
          onClose={handleCloseDrawer}
          book={selectedBook}
        />
        <ChatDrawer
          open={openChatDrawer}
          onClose={handleCloseChatDrawer}
          otherUserId={chatDetails.sellerId}
          otherUserName={chatDetails.sellerName}
          userName={chatDetails.buyerName}
          bookName={chatDetails.bookName}
        />
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      </main>
      <MobileFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        category={category}
        setCategory={setCategory}
        dealType={dealType}
        setDealType={setDealType}
      />
    </>
  );
};

export default Home;
