import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
export const usePostInteractions = (user) => {
    const [buyerName, setBuyerName] = useState(null);

    useEffect(() => {
        if (!user?.id) return;

        const fetchUserName = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("name")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error(error);
                return;
            }
            setBuyerName(data.name);
        };

        fetchUserName();
    }, [user]);
    const [openLogin, setOpenLogin] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openChatDrawer, setOpenChatDrawer] = useState(false);
    const [chatDetails, setChatDetails] = useState({
        sellerId: null,
        sellerName: null,
        buyerName: null,
        bookName: null,
    });

    const handleOpenDrawer = (book) => {
        setSelectedBook(book);
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelectedBook(null);
    };

    const handleOpenChatDrawer = (book) => {
        if (!user) {
            setOpenLogin(true);
            return;
        }

        setChatDetails({
            sellerId: book.user_id,
            sellerName: book.users?.name,
            buyerName: buyerName,
            bookName: book.book_name,
        });
        setOpenChatDrawer(true);
    };

    const handleCloseChatDrawer = () => {
        setOpenChatDrawer(false);
        setChatDetails({
            sellerId: null,
            sellerName: null,
            buyerName: null,
            bookName: null,
        });
    };

    return {
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
    };
};