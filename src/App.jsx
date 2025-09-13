import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./home/Home.jsx";
import Login from "./auth/LoginFinal.jsx";
import Account from "./account/Account.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserPosts from "./account/UserPosts.jsx";
import UserSavedPosts from "./account/UserSavedPosts.jsx";
import UserConversations from "./account/UserConversations.jsx";
import Books from "./home/Books.jsx";
import { ToastContainer } from "react-toastify";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import { MobileFiltersProvider } from "./context/MobileFiltersContext.jsx";
import SupabaseLogin from "./auth/SupabaseLogin.jsx";
import TodoList from "./components/ToDoList.jsx";
import LoginPage from "./auth/LoginFinal.jsx";
function App() {
  return (
    <>
      {/* <GoogleOAuthProvider
        clientId={
          "739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com"
        }
      > */}
      <AuthProvider>
        <MobileFiltersProvider>
          <ToastContainer />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/books"
                element={
                  <div className="mt-6">
                    <Books />
                  </div>
                }
              />
              <Route path="/login" element={<SupabaseLogin />} />
              <Route path="/login1" element={<LoginPage />} />
              <Route path="/todo" element={<TodoList />} />
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
      {/* </GoogleOAuthProvider> */}
    </>
  );
}

export default App;
