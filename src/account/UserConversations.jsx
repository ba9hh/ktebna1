import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider.jsx";
import { supabase } from "../supabaseClient.js";
import { useQuery } from "@tanstack/react-query";
import ChatDrawer from "../chat/ChatDrawer.jsx";
import { useTranslation } from "react-i18next";

const UserConversations = () => {
  const { t } = useTranslation();
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const getUserConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
      *,
      first_user:users!conversations_first_user_id_fkey(id, name, email, profile_picture),
      second_user:users!conversations_second_user_id_fkey(id, name, email, profile_picture)
    `
      )
      .or(`first_user_id.eq.${user?.id},second_user_id.eq.${user?.id}`)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    console.log(data);
    return data;
  };
  const {
    data: conversations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getUserConversations(),
  });
  console.log(conversations);
  return (
    <div className="border flex flex-col flex-1 rounded-xl shadow-md pt-4 p-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        {t("conversations.title")}
      </h2>
      {isLoading ? (
        <p className="text-gray-500 italic text-center">
          {t("conversations.loading")}
        </p>
      ) : conversations?.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          {t("conversations.noConversations")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {conversations?.map((conv) => {
            const otherUser =
              conv.first_user_id === user?.id
                ? conv.second_user
                : conv.first_user;

            return (
              <div
                key={conv._id}
                onClick={() => {
                  setSelectedSeller(otherUser.id);
                  setSelectedName(otherUser.name);
                  setOpen(true);
                }}
                className="flex items-center justify-between p-4 bg-white rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      otherUser.profile_picture ||
                      "https://via.placeholder.com/40"
                    }
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium truncate max-w-40">
                      {otherUser.name} ({conv.conversation_topic})
                    </p>
                    {/* <p className="text-sm text-gray-500">{otherUser.email}</p> */}
                    <p className="text-sm text-gray-500 truncate max-w-40">
                      {conv.last_message_sender === user?.id
                        ? `${t("conversations.you")}: `
                        : `${otherUser.name}: `}
                      {conv.last_message_content}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </span>
              </div>
            );
          })}
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
        />
      )}
    </div>
  );
};

export default UserConversations;
