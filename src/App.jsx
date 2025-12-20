import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./home/Home.jsx";
import Account from "./account/Account.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import UserPosts from "./account/UserPosts.jsx";
import UserSavedPosts from "./account/UserSavedPosts.jsx";
import UserConversations from "./account/UserConversations.jsx";
import Books from "./home/Books.jsx";
import { ToastContainer } from "react-toastify";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import { MobileFiltersProvider } from "./context/MobileFiltersContext.jsx";
import LoginPage from "./auth/LoginFinal.jsx";
function App() {
  return (
    <>
      <AuthProvider>
        <MobileFiltersProvider>
          <ToastContainer />
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <div className="mt-6">
                    <Books />
                  </div>
                }
              />
              <Route
                path="/books"
                element={
                  <div className="mt-6">
                    <Books />
                  </div>
                }
              />
              <Route path="/login1" element={<LoginPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />}>
                <Route index element={null} />
                <Route path="posts" element={<UserPosts />} />
                <Route path="savedPosts" element={<UserSavedPosts />} />
                <Route path="conversations" element={<UserConversations />} />
              </Route>
            </Route>
          </Routes>
        </MobileFiltersProvider>
      </AuthProvider>
    </>
  );
}

export default App;
